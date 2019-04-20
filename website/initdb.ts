import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';
import { UsersSchema } from './api/modules/auth/users/mongoose';
import { RolesSchema } from './api/modules/auth/roles/mongoose';
import { QuizzSchema } from './api/modules/quizzes/mongoose';
import { UserPermissions, QuizzMasterPermissions } from './nextjs/constants/user-permissions.constant';
import config from './configs';

mongoose.connect(`${config.database.mongoConnectionString}`, {
  useNewUrlParser: true,
}, async (_err) => {
  const User = mongoose.model('User', UsersSchema);
  const Role = mongoose.model('Role', RolesSchema);
  const Quizz = mongoose.model('Quizz', QuizzSchema);

  const existedAdministrator = await Role.findOne({ name: 'Administrator' }).exec();
  if (existedAdministrator) {
    await Role.deleteOne({ _id: existedAdministrator._id }).exec();
  }
  const administrator = new Role({
    name: 'ADMINISTRATOR',
    normalizedName: 'administrator',
    permissions: Object.keys(UserPermissions).map((key) => UserPermissions[key]),
    isDefault: false,
    isActive: true,
    createdAt: new Date(),
    createdBy: 'Boostrap-Script',
  });
  await administrator.save();

  const quizzMaster = new Role({
    name: 'QUIZZ_MASTER',
    normalizedName: 'quizz_master',
    permissions: Object.keys(QuizzMasterPermissions).map((key) => QuizzMasterPermissions[key]),
    isDefault: false,
    isActive: true,
    createdAt: new Date(),
    createdBy: 'Boostrap-Script',
  });
  await quizzMaster.save();

  const randomEl = (list: any) => {
    const i = Math.floor(Math.random() * list.length);
    return list[i];
  };
  // tslint:disable-next-line:max-line-length
  const adjectives = ['adamant', 'adroit', 'amatory', 'animistic', 'antic', 'arcadian', 'baleful', 'bellicose', 'bilious', 'boorish', 'calamitous', 'caustic', 'cerulean', 'comely', 'concomitant', 'contumacious', 'corpulent', 'crapulous', 'defamatory', 'didactic', 'dilatory', 'dowdy', 'efficacious', 'effulgent', 'egregious', 'endemic', 'equanimous', 'execrable', 'fastidious', 'feckless', 'fecund', 'friable', 'fulsome', 'garrulous', 'guileless', 'gustatory', 'heuristic', 'histrionic', 'hubristic', 'incendiary', 'insidious', 'insolent', 'intransigent', 'inveterate', 'invidious', 'irksome', 'jejune', 'jocular', 'judicious', 'lachrymose', 'limpid', 'loquacious', 'luminous', 'mannered', 'mendacious', 'meretricious', 'minatory', 'mordant', 'munificent', 'nefarious', 'noxious', 'obtuse', 'parsimonious', 'pendulous', 'pernicious', 'pervasive', 'petulant', 'platitudinous', 'precipitate', 'propitious', 'puckish', 'querulous', 'quiescent', 'rebarbative', 'recalcitant', 'redolent', 'rhadamanthine', 'risible', 'ruminative', 'sagacious', 'salubrious', 'sartorial', 'sclerotic', 'serpentine', 'spasmodic', 'strident', 'taciturn', 'tenacious', 'tremulous', 'trenchant', 'turbulent', 'turgid', 'ubiquitous', 'uxorious', 'verdant', 'voluble', 'voracious', 'wheedling', 'withering', 'zealous'];
  // tslint:disable-next-line:max-line-length
  const nouns = ['ninja', 'chair', 'pancake', 'statue', 'unicorn', 'rainbows', 'laser', 'senor', 'bunny', 'captain', 'nibblets', 'cupcake', 'carrot', 'gnomes', 'glitter', 'potato', 'salad', 'toejam', 'curtains', 'beets', 'toilet', 'exorcism', 'stick figures', 'mermaid eggs', 'sea barnacles', 'dragons', 'jellybeans', 'snakes', 'dolls', 'bushes', 'cookies', 'apples', 'ice cream', 'ukulele', 'kazoo', 'banjo', 'opera singer', 'circus', 'trampoline', 'carousel', 'carnival', 'locomotive', 'hot air balloon', 'praying mantis', 'animator', 'artisan', 'artist', 'colorist', 'inker', 'coppersmith', 'director', 'designer', 'flatter', 'stylist', 'leadman', 'limner', 'make-up artist', 'model', 'musician', 'penciller', 'producer', 'scenographer', 'set decorator', 'silversmith', 'teacher', 'auto mechanic', 'beader', 'bobbin boy', 'clerk of the chapel', 'filling station attendant', 'foreman', 'maintenance engineering', 'mechanic', 'miller', 'moldmaker', 'panel beater', 'patternmaker', 'plant operator', 'plumber', 'sawfiler', 'shop foreman', 'soaper', 'stationary engineer', 'wheelwright', 'woodworkers'];

  const existedAdmin = await User.findOne({ email: 'admin@email.com' }).exec();
  if (existedAdmin) {
    await User.deleteOne({ _id: existedAdmin._id }).exec();
  }
  for (let i = 0; i < 10; i++) {
    const admin = new User({
      password: bcrypt.hashSync('Abc@12345', 'Abc@12345'.length),
      firstName: '',
      middleName: '',
      lastName: '',
      email: `${randomEl(adjectives)}_${randomEl(nouns)}_${++i}@gmail.com`,
      fullName: '',
      normalizedFullName: '',
      externalLogin: {
        google: {
          id: '',
          email: '',
        },
        facebook: {
          id: '',
          email: '',
        },
      },
      permissions: Object.keys(UserPermissions).map((key) => UserPermissions[key]),
      roles: ['QUIZZ_MASTER'],
      isActive: true,
      isLocked: false,
      failLoginTryCount: 0,
      emailConfirmed: true,
      language: 'en',
      username: `${randomEl(adjectives)}_${randomEl(nouns)}_${++i}`,
      scorePoint: 0,
      rewardPoint: 1000,
      resetPasswordToken: '',
      createdAt: new Date(),
      resetPasswordExpires: new Date(0),
    });
    await admin.save();

  }
  for (let i = 0; i < 10; i++) {
    const quizz = new Quizz({
      coverImageUrl: 'https://pixabay.com/en/santa-christmas-santa-claus-2563805',
      title: `Santa Claus: How much do you know about him?${++i}`,
      description: 'Jovial, generous, legendary, white-breaded - it\'s all about him, Santa Claus! How much exactly do you know about Santa? Test your knowledge in this #Christmas quiz. Ho-ho-ho!',
      state: 'PUBLISHED',
      beacon: {
        isActive: false,
        uuid: '',
        major: '',
        minor: '',
      },
      questions: [
        {
          answers: [
            {
              id: 0,
              description: 'Bristish',
              isCorrect: false,
            },
            {
              id: 1,
              description: 'Sami',
              isCorrect: false,
            },
            {
              id: 2,
              description: 'Dutch',
              isCorrect: true,
            },
            {
              id: 3,
              description: 'Viking',
              isCorrect: false,
            },
          ],
          id: 0,
          coverType: 'IMAGE',
          coverUrl: 'https://lumileds.techkids.io/static/temps/images/84fcff56aa6c7cfb28e0cbe9ea3ca680.jpeg',
          description: 'It was ___ settlers who brought the Santa Claus tradition to America',
        },
        {
          id: 1,
          coverType: 'IMAGE',
          coverUrl: 'https://lumileds.techkids.io/static/temps/images/a8fe9e37df2a63054f15091e7e5a6436.jpeg',
          description: 'When was the name \'Santa Claus\' used for the first time in America?',
          answers: [
            {
              id: 0,
              description: '1880',
              isCorrect: false,
            },
            {
              id: 1,
              description: '1820',
              isCorrect: false,
            },
            {
              id: 2,
              description: '1773',
              isCorrect: true,
            },
            {
              id: 3,
              description: '1750',
              isCorrect: false,
            },
          ],
        },
        {
          id: 2,
          coverType: 'IMAGE',
          coverUrl: 'https://lumileds.techkids.io/static/temps/images/a8fe9e37df2a63054f15091e7e5a6436.jpeg',
          description: 'The figure of Santa Claus is based on St. Nicholas who lived in the 4th century. Where exactly?',
          answers: [
            {
              id: 0,
              description: 'Rome',
              isCorrect: false,
            },
            {
              id: 1,
              description: 'North Pole',
              isCorrect: false,
            },
            {
              id: 2,
              description: 'Turkey',
              isCorrect: true,
            },
            {
              id: 3,
              description: 'Germany',
              isCorrect: false,
            },
          ],
        },
        {
          id: 3,
          coverType: 'IMAGE',
          coverUrl: 'https://lumileds.techkids.io/static/temps/images/a8fe9e37df2a63054f15091e7e5a6436.jpeg',
          description: 'Where is today\'s Santa\'s home said to be?',
          answers: [
            {
              id: 0,
              description: 'Nova Scotia',
              isCorrect: false,
            },
            {
              id: 1,
              description: 'Macy\'s',
              isCorrect: false,
            },
            {
              id: 2,
              description: 'close to the North Pole',
              isCorrect: true,
            },
            {
              id: 3,
              description: 'Norway',
              isCorrect: false,
            },
          ],
        },
      ],
      createdBy: 'Boostrap-Script',
      createdAt: new Date(),
      questionCount: 4,
      __v: 0,
    });
    await quizz.save();
  }

  // tslint:disable-next-line:no-console
  console.log(
    `
    FINISH
    You Can Log In As:
      email: anhvu@techkids.io
      password: Abc@12345
    `,
  );
  process.exit();
});
