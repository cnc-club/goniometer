	/********************************************************************
* Description: 5axiskins.c
*   kinematics for XYZBC 5 axis bridge mill
*
*   Derived from a work by Fred Proctor & Will Shackleford
*
* Author:
* License: GPL Version 2
* System: Linux
*	
* Copyright (c) 2007 Chris Radek
*
* Last change:
********************************************************************/

#include "kinematics.h"		/* these decls */
#include "posemath.h"
#include "hal.h"
#include "rtapi_math.h"

#define d2r(d) ((d)*PM_PI/180.0)
#define r2d(r) ((r)*180.0/PM_PI)

struct haldata {
	hal_float_t *r;
} *haldata;

#define JOINT_0 0
#define JOINT_1 1
#define JOINT_2 2
#define JOINT_A 3
#define JOINT_B 4

int kinematicsForward(const double *joints,
			  EmcPose * pos,
			  const KINEMATICS_FORWARD_FLAGS * fflags,
			  KINEMATICS_INVERSE_FLAGS * iflags)
{
	double x,y,z, x0,y0,z0, x1,y1,z1, xl,yl,zl, a,b;  
	//fwd
	//x,y,z,a,b -> xl,yl,zl(h),a,b
	// rotate along -A 
	x = joints[JOINT_0] - *(haldata->r);
	y = joints[JOINT_1];
	z = joints[JOINT_2];
	a = d2r(joints[JOINT_A]);
	b = d2r(joints[JOINT_B]);
	
	x0 = x*cos(-a) - y*sin(-a);
	y0 = x*sin(-a) + y*cos(-a); 
	z0 = z;
	
	// rotate along -B
	x1 = x0*cos(-b) - z0*sin(-b); 
	y1 = y0;
	z1 = x0*sin(-b) + z0*cos(-b);
		
	// offsets
	xl = y1;
	yl = z1;
	zl = x1;
	pos->tran.x = xl;
	pos->tran.y = yl;
	pos->tran.z = zl;
	pos->a      = joints[JOINT_A];
	pos->b      = joints[JOINT_B];

	return 0;
}

int kinematicsInverse(const EmcPose * pos,
			  double *joints,
			  const KINEMATICS_INVERSE_FLAGS * iflags,
			  KINEMATICS_FORWARD_FLAGS * fflags)
{
	double x0,y0,z0, x1,y1,z1, x2,y2,z2, a,b;
	a = d2r(pos->a);
	b = d2r(pos->b);	
	//xl,yl,h,a,b -> x,y,z,a,b
	x0 = pos->tran.z;
	y0 = pos->tran.x;
	z0 = pos->tran.y;
	
	// rotate along B
	x1 = x0*cos(b) - z0*sin(b); 
	y1 = y0;
	z1 = x0*sin(b) + z0*cos(b);
	
	// rotate along A
	x2 = x1*cos(a) - y1*sin(a);
	y2 = x1*sin(a) + y1*cos(a);
	z2 = z1;

	joints[JOINT_0] = x2 + *(haldata->r);
	joints[JOINT_1] = y2;
	joints[JOINT_2] = z2;
	joints[JOINT_A] = pos->a;
	joints[JOINT_B] = pos->b;

	return 0;
}

/* implemented for these kinematics as giving joints preference */

int kinematicsHome(EmcPose * world,
		   double *joint,
		   KINEMATICS_FORWARD_FLAGS * fflags,
		   KINEMATICS_INVERSE_FLAGS * iflags)
{
	
	*fflags = 0;
	*iflags = 0;		
	return kinematicsForward(joint, world, fflags, iflags);
}



KINEMATICS_TYPE kinematicsType()
{
	return KINEMATICS_BOTH;
}

#include "rtapi.h"		/* RTAPI realtime OS API */
#include "rtapi_app.h"		/* RTAPI realtime module decls */
#include "hal.h"

EXPORT_SYMBOL(kinematicsType);
EXPORT_SYMBOL(kinematicsForward);
EXPORT_SYMBOL(kinematicsInverse);
MODULE_LICENSE("GPL");

int comp_id;
int rtapi_app_main(void) {
	int result;
	comp_id = hal_init("5axis-ab");
	if(comp_id < 0) return comp_id;

	haldata = hal_malloc(sizeof(struct haldata));

	result = hal_pin_float_new("5axis-ab.r", HAL_IO, &(haldata->r), comp_id);
	if(result < 0) goto error;

	*(haldata->r) = 1000.0;

	hal_ready(comp_id);
	return 0;

error:
	hal_exit(comp_id);
	return result;
}

void rtapi_app_exit(void) { hal_exit(comp_id); }
