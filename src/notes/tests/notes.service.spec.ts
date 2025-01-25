import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from '../services/notes.service';
import { Note } from '../entities/note.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UpdateNoteDto } from '../dto/notes.dto';
import { CustomException } from '../../common/exceptions/custom.exception';

import { constants } from '../constants/notes.constants';
const { RESPONSES, NOTES_CACHE_KEY, NOTES_CACHE_DURATION_MS } = constants;

describe('NotesService', () => {
  let service: NotesService;
  let repository: Repository<Note>;
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            find: jest.fn(),
            merge: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => jest.fn(),
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    repository = module.get<Repository<Note>>(getRepositoryToken(Note));
    cache = module.get(CACHE_MANAGER);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    // Creates a new note with valid title and description
    it('should create note with valid title and description', async () => {
      const createNoteDto = {
        title: 'Test Title',
        description: 'Test Description',
      };
      jest.spyOn(repository, 'save').mockResolvedValue({
        id: '123',
        title: 'Test Title',
        description: 'Test Description',
        created_at: new Date(),
        updated_at: new Date(),
      });
      const result = await service.create(createNoteDto);
      const mockNoteInstance = new Note();
      mockNoteInstance.title = createNoteDto.title;
      mockNoteInstance.description = createNoteDto.description;

      expect(repository.save).toHaveBeenCalledWith(mockNoteInstance);
      expect(result.title).toBe(createNoteDto.title);
      expect(result.description).toBe(createNoteDto.description);
    });
  });

  describe('update', () => {
    // Successfully updates a note with valid ID and valid update data
    it('should successfully update note when valid ID and data provided', async () => {
      const mockNote: Note = {
        id: 'test-id',
        title: 'Test Note',
        description: 'Test Description',
        created_at: undefined,
        updated_at: undefined,
      };
      const updateDto: UpdateNoteDto = {
        title: 'Updated Title',
      };

      const getOneSpy = jest
        .spyOn(service, 'getOne')
        .mockResolvedValue(mockNote);
      const mergeSpy = jest.spyOn(repository, 'merge');
      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...mockNote, ...updateDto });
      const result = await service.update('test-id', updateDto);
      expect(getOneSpy).toHaveBeenCalledWith('test-id');
      expect(mergeSpy).toHaveBeenCalledWith(mockNote, updateDto);
      expect(saveSpy).toHaveBeenCalled();
      expect(result.title).toBe('Updated Title');
    });
  });

  describe('delete', () => {
    // Successfully delete note when valid noteId is provided
    it('should successfully delete note when valid noteId is provided', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({
        raw: [],
        affected: 1,
      });
      const noteId = 'test-id';
      const spy = jest.spyOn(repository, 'delete');
      await service.delete(noteId);
      expect(spy).toHaveBeenCalledWith(noteId);
    });
  });

  describe('findOne', () => {
    // Returns a Note object when a valid noteId is provided
    it('should return note when valid noteId is provided', async () => {
      const mockNote: Note = {
        id: 'test-id',
        title: 'Test Note',
        description: 'Test Description',
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockNote);
      const result = await service.getOne('test-id');
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'test-id' });
      expect(result).toEqual(mockNote);
    });
    // Throws CustomException when note is not found
    it('should throw CustomException when note is not found', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(null);
      await expect(service.getOne('non-existent-id')).rejects.toThrow(
        new CustomException(
          RESPONSES.NOT_FOUND.code,
          RESPONSES.NOT_FOUND.message,
          RESPONSES.NOT_FOUND.http_code,
        ),
      );
    });
  });

  describe('find', () => {
    // Returns an array of all notes from the repository
    it('should return all notes from repository', async () => {
      const mockNotes: Note[] = [
        {
          id: '1',
          title: 'Note 1',
          description: 'Desc 1',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '2',
          title: 'Note 2',
          description: 'Desc 2',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockNotes);
      const result = await service.getAll();
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNotes);
    });
  });

  describe('getAllV2', () => {
    // Returns cached notes when cache exists
    it('should return cached notes when cache exists', async () => {
      const cachedNotes: Note[] = [
        {
          id: '1',
          title: 'Note 1',
          description: 'Desc 1',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      jest.spyOn(cache, 'get').mockResolvedValue(cachedNotes);
      jest.spyOn(service, 'getAll');
      const result = await service.getAllV2();
      expect(cache.get).toHaveBeenCalledWith(NOTES_CACHE_KEY);
      // make sure that database have not been called
      expect(service.getAll).toHaveBeenCalledTimes(0);
      expect(result).toEqual(cachedNotes);
    });
    // Handles empty array of notes from repository
    it('should handle empty notes array and set cache', async () => {
      const mockNotes: Note[] = [
        {
          id: '1',
          title: 'Note 1',
          description: 'Desc 1',
          created_at: undefined,
          updated_at: undefined,
        },
      ];
      cache.get = jest.fn().mockResolvedValue(null);
      jest.spyOn(service, 'getAll').mockResolvedValue(mockNotes);
      jest.spyOn(cache, 'set');
      const result = await service.getAllV2();
      expect(service.getAll).toHaveBeenCalled();
      expect(cache.set).toHaveBeenCalledWith(
        NOTES_CACHE_KEY,
        mockNotes,
        NOTES_CACHE_DURATION_MS,
      );
      expect(result).toEqual(mockNotes);
    });
  });
});
