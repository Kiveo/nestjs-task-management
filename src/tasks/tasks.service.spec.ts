import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './tasks.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 12, username: 'Test User' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TasksService, { provide: TaskRepository, useFactory: mockTaskRepository }],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from task repo', async () => {
      taskRepository.getTasks.mockResolvedValue('A specific value');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Search query' };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toBe('A specific value');
    });
  });

  // async getTaskById(id: number, user: User): Promise<Task> {
  //   const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
  //   if (!found) {
  //     throw new NotFoundException(`Task with ID "${id}" not found`);
  //   }
  //   return found;
  // }
  describe('getTaskById', () => {
    it('calls taskRepository.find() and returns the task', async () => {
      const mockTask = { title: 'test task', description: 'test description' };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: mockUser.id } });
    });

    it('throws an error if the task is not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });
});
