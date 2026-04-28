/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProgress {
  points: number;
  level: 'Новачок' | 'Дослідник' | 'Експерт';
  completedModules: string[];
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const INITIAL_PROGRESS: UserProgress = {
  points: 0,
  level: 'Новачок',
  completedModules: [],
  badges: [],
};

export const BADGES: Badge[] = [
  { id: 'theory_master', name: 'Магістр Теорії', icon: 'BookOpen', description: 'Завершено всі теоретичні модулі' },
  { id: 'brain_explorer', name: 'Дослідник Мозку', icon: 'Brain', description: 'Вивчено всі схеми мозку' },
  { id: 'test_champion', name: 'Чемпіон Тестів', icon: 'Trophy', description: 'Пройдено всі тести на 100%' },
];
