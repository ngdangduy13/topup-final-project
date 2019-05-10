import {
  IFindQuizzQuery,
  IFindQuizzResult,
  ICreateQuizzInput,
  IFindQuizzDetail,
  IDeactivateQuizz,
  IUpdateQuizzInput,
  ISubmitAnswersInput,
  ISubmitAnswersResult,
  IActivateQuizz,
} from './interface';
import repository from './repository';
import quizScoreboardRepository from './total-scoreboard/quiz-scoreboard/repository';
import * as Joi from 'joi';
import { addModificationAuditInfo, addCreationAuditInfo } from '../../core/helpers';
import userRepository from '../auth/users/repository';
import totalScoreBoardRepository from './total-scoreboard/repository';

const findQuizzes = async (query: IFindQuizzQuery): Promise<IFindQuizzResult> => {
  return await repository.findQuizzes(query);
};

const createQuizz = async (body: ICreateQuizzInput): Promise<IFindQuizzDetail> => {
  const validationRule = Joi.object().keys({
    coverImageUrl: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    state: Joi.string().required(),
    beacon: Joi.object(),
    questions: Joi.array().items({
      id: Joi.number().required(),
      coverType: Joi.string(),
      coverUrl: Joi.string(),
      description: Joi.string().required(),
      answers: Joi.array()
        .items({
          id: Joi.number().required(),
          description: Joi.string().required(),
          isCorrect: Joi.bool().required(),
        })
        .required(),
    }),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });
  if (body.state && body.state !== 'DRAFT') {
    if (error) {
      throw new Error(error.details[0].message);
    }

    const checkExistTitle = await repository.findQuizzByTitle(body.title);
    if (checkExistTitle) {
      throw new Error('Title already exists');
    }
  }

  return await repository.createQuizz(body);
};

const deactivateQuizz = async (params: IDeactivateQuizz): Promise<void> => {
  return await repository.deactivateQuizz(params);
};

const activateQuizz = async (params: IActivateQuizz): Promise<void> => {
  return await repository.activateQuizz(params);
};

const updateQuizz = async (body: IUpdateQuizzInput): Promise<void> => {
  const validationRule = Joi.object().keys({
    coverImageUrl: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    state: Joi.string().required(),
    beacon: Joi.object(),
    questions: Joi.array().items({
      id: Joi.number().required(),
      coverType: Joi.string(),
      coverUrl: Joi.string(),
      description: Joi.string().required(),
      answers: Joi.array()
        .items({
          id: Joi.number().required(),
          description: Joi.string().required(),
          isCorrect: Joi.bool().required(),
        })
        .required(),
    }),
  });
  const { error } = Joi.validate(body, validationRule, {
    allowUnknown: true,
  });

  if (body.state && body.state !== 'DRAFT') {
    if (error) {
      throw new Error(error.details[0].message);
    }

    const checkExistTitle = await repository.findQuizzByTitle(body.title);
    if (checkExistTitle && checkExistTitle._id.toString() !== body._id.toString()) {
      throw new Error('Title already exists');
    }
  }

  return await repository.updateQuizz(body);
};

const findQuizzById = async (id: string): Promise<IFindQuizzDetail> => {
  return await repository.findQuizzBydId(id);
};

const submitAnswer = async (
  body: ISubmitAnswersInput,
  user: any
): Promise<ISubmitAnswersResult> => {
  const quizDetail = await repository.findQuizzBydId(body.quizId);

  const usernameResult = await userRepository.findUserNameById(body.userId);

  let correctAnswerCount = 0;
  let points = 0;
  let rewardPoints = 0;
  for (const question of quizDetail.questions) {
    for (const answer of question.answers) {
      for (const userAnswer of body.answers) {
        if (
          userAnswer.questionId === question.id &&
          answer.id === userAnswer.answerId &&
          answer.isCorrect
        ) {
          correctAnswerCount += 1;
          points += 100;
          rewardPoints += 50;
        }
      }
    }
  }
  // const isUserScoreboardExist = await quizScoreboardRepository.isUserScoreboardExist({ userId: body.userId, quizId: body.quizId });
  const scoreboard: any = {
    userId: body.userId,
    quizId: body.quizId,
    points,
    username: usernameResult,
    firstSubmittedAt: new Date(),
  };
  // if (isUserScoreboardExist) {
  //     await quizScoreboardRepository.updateScoreboard(addModificationAuditInfo(user, scoreboard));
  // } else {
  // }
  const findScoreBoardByQuizIdAndUserId = await totalScoreBoardRepository.findScoreboard({
    userId: body.userId,
    quizId: body.quizId,
    pageIndex: '',
    pageOrientation: true,
    pageSize: 1,
    sortBy: 'createdAt',
  });
  const findScoreBoardByUserId = await totalScoreBoardRepository.findScoreboard({
    userId: body.userId,
    pageIndex: '',
    pageOrientation: true,
    pageSize: 1,
    sortBy: 'createdAt',
  });
  const isUserScoreboardExist = findScoreBoardByUserId.data.length > 0;
  await quizScoreboardRepository.createScoreboard(addCreationAuditInfo(user, scoreboard));

  if (!isUserScoreboardExist) {
    await totalScoreBoardRepository.createScoreboard(
      addCreationAuditInfo(user, {
        userId: body.userId,
        points,
        username: usernameResult,
        profileImgUrl: user.profileImgUrl,
        quizId: [body.quizId],
      })
    );
    await userRepository.updateUserScore(
      addModificationAuditInfo(user, {
        id: body.userId,
        points,
      })
    );
  } else {
    const isUserHavePlayedBefore = findScoreBoardByQuizIdAndUserId.data.length > 0;
    if (!isUserHavePlayedBefore) {
      await userRepository.updateUserScore(
        addModificationAuditInfo(user, {
          id: body.userId,
          points,
          rewardPoints,
        })
      );
      await totalScoreBoardRepository.updateScoreboard(
        addModificationAuditInfo(user, {
          userId: body.userId,
          points,
          username: usernameResult,
          quizId: body.quizId,
          profileImgUrl: user.profileImgUrl,
        })
      );
    }
  }

  return { points, correctAnswerCount, rewardPoints };
};

export default {
  findQuizzes,
  createQuizz,
  deactivateQuizz,
  updateQuizz,
  findQuizzById,
  submitAnswer,
  activateQuizz,
};
