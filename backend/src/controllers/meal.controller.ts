import { Request, Response, NextFunction } from 'express';
import * as mealService from '../services/meal.service';

export const createMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const meal = await mealService.createMeal(userId, req.body);

    res.status(201).json({
      status: 'success',
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserMeals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const limit = parseInt(req.query.limit as string) || 50;

    const meals = await mealService.getUserMeals(userId, limit);

    res.json({
      status: 'success',
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const mealId = req.params.id;

    await mealService.deleteMeal(userId, mealId);

    res.json({
      status: 'success',
      message: 'Meal log deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
