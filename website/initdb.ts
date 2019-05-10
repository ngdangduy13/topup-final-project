import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';
import { UsersSchema } from './api/modules/auth/users/mongoose';
import { RolesSchema } from './api/modules/auth/roles/mongoose';
import { QuizzSchema } from './api/modules/quizzes/mongoose';
import { VoucherSchema } from './api/modules/voucher/mongoose';
import {
  UserPermissions,
  QuizzMasterPermissions,
} from './nextjs/constants/user-permissions.constant';
import config from './configs';

mongoose.connect(
  `${config.database.mongoConnectionString}`,
  {
    useNewUrlParser: true,
  },
  async _err => {
    const User = mongoose.model('User', UsersSchema);
    const Role = mongoose.model('Role', RolesSchema);
    const Quizz = mongoose.model('Quizz', QuizzSchema);
    const Voucher = mongoose.model('Voucher', VoucherSchema);

    const existedAdministrator = await Role.findOne({ name: 'Administrator' }).exec();
    if (existedAdministrator) {
      await Role.deleteOne({ _id: existedAdministrator._id }).exec();
    }
    const administrator = new Role({
      name: 'ADMINISTRATOR',
      normalizedName: 'administrator',
      permissions: Object.keys(UserPermissions).map(key => UserPermissions[key]),
      isDefault: false,
      isActive: true,
      createdAt: new Date(),
      createdBy: 'Boostrap-Script',
    });
    await administrator.save();

    const quizzMaster = new Role({
      name: 'QUIZZ_MASTER',
      normalizedName: 'quizz_master',
      permissions: Object.keys(QuizzMasterPermissions).map(key => QuizzMasterPermissions[key]),
      isDefault: false,
      isActive: true,
      createdAt: new Date(),
      createdBy: 'Boostrap-Script',
    });
    await quizzMaster.save();
    // tslint:disable-next-line:max-line-length

    const existedAdmin = await User.findOne({ email: 'admin@gmail.com' }).exec();
    if (!existedAdmin) {
      const admin = new User({
        password: bcrypt.hashSync('123456', '123456'.length),
        firstName: '',
        middleName: '',
        lastName: '',
        email: `admin@gmail.com`,
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
        permissions: Object.keys(UserPermissions).map(key => UserPermissions[key]),
        roles: ['ADMINISTRATOR', 'QUIZZ_MASTER'],
        isActive: true,
        isLocked: false,
        failLoginTryCount: 0,
        emailConfirmed: true,
        language: 'en',
        username: `Duy Nguyen`,
        scorePoint: 0,
        rewardPoint: 1000,
        resetPasswordToken: '',
        createdAt: new Date(),
        resetPasswordExpires: new Date(0),
      });
      await admin.save();
    }
    for (let i = 0; i < 10; i++) {
      const admin = new User({
        password: bcrypt.hashSync('Abc@12345', 'Abc@12345'.length),
        firstName: '',
        middleName: '',
        lastName: '',
        email: `test_email_${++i}@gmail.com`,
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
        permissions: Object.keys(UserPermissions).map(key => UserPermissions[key]),
        roles: ['QUIZZ_MASTER'],
        isActive: true,
        isLocked: false,
        failLoginTryCount: 0,
        emailConfirmed: true,
        language: 'en',
        username: `test_username_${++i}`,
        scorePoint: 0,
        rewardPoint: 1000,
        resetPasswordToken: '',
        createdAt: new Date(),
        resetPasswordExpires: new Date(0),
      });
      await admin.save();
    }

    for (let i = 0; i < 5; i++) {
      const voucher = new Voucher({
        coverUrl: '/static/temps/images/santa.jpg',
        name: 'Discount 30% Starbucks',
        pointForExchange: 100000,
        createdBy: 'Boostrap-Script',
        createdAt: new Date(),
        code: Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, '')
          .substr(0, 5)
          .toLocaleUpperCase(),
        description:
          'Khởi nghiệp từ một quán cà phê nhỏ chuyên bán cà phê hạt từ 40 năm về trước tại Mỹ, Starbucks trở thành thương hiệu tiên phong mở ra cuộc cách mạng về cà phê xay pha sẵn được bán tại cửa hàng khi mà cà phê được mặc định như một loại thức uống chỉ chuẩn bị tại nhà. Đến nay, Starbucks đã trở thành thương hiệu cà phê đẳng cấp nhất và nổi tiếng trên toàn thế giới.Tại Việt Nam, Starbucks đã chinh phục khách hàng bằng sự quyến rũ từ hương vị cà phê, đến không gian thưởng thức. Uống một lần rồi đam mê, người Việt dần dần nhận ra sự mới lạ đến từ thứ đồ uống đẳng cấp thế giới này, thế là họ đam mê và dám thay đổi thói quen của mình để tìm đến với Starbucks, đến nay Starbucks đã mở rộng hệ thống hơn 30 cửa hàng tại Việt Nam. Thấu hiểu một cách sâu sắc văn hóa cà phê của người Người Việt, mỗi cửa hàng Starbucks đã sáng tạo nên những cửa hàng cà phê với không gian ấm cúng với những nét riêng thể hiện sự hiện đại năng động không nơi đâu có được. Các cửa hàng đều được thiết kế theo phong cách hoài cổ nhưng vẫn tôn nên sự sang trọng. Nội thất, đồ trang trí trong các cửa hàng do các nghệ sỹ trong nước thực hiện cũng như được mua từ các nhà cung cấp ở địa phương, mang đậm bản sắc văn hóa người Việt. ',
      });
      await voucher.save();
    }

    for (let i = 0; i < 10; i++) {
      const quizz = new Quizz({
        coverImageUrl: '/static/temps/images/santa.jpg',
        title: `Santa Claus: How much do you know about him?${++i}`,
        description:
          "Jovial, generous, legendary, white-breaded - it's all about him, Santa Claus! How much exactly do you know about Santa? Test your knowledge in this #Christmas quiz. Ho-ho-ho!",
        state: 'PUBLISHED',

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
            coverUrl: '/static/temps/images/santa.jpg',
            description: 'It was ___ settlers who brought the Santa Claus tradition to America',
          },
          {
            id: 1,
            coverType: 'IMAGE',
            coverUrl: '/static/temps/images/santa.jpg',
            description: "When was the name 'Santa Claus' used for the first time in America?",
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
            coverUrl: '/static/temps/images/santa.jpg',
            description:
              'The figure of Santa Claus is based on St. Nicholas who lived in the 4th century. Where exactly?',
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
            coverUrl: '/static/temps/images/santa.jpg',
            description: "Where is today's Santa's home said to be?",
            answers: [
              {
                id: 0,
                description: 'Nova Scotia',
                isCorrect: false,
              },
              {
                id: 1,
                description: "Macy's",
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
      email: admin@gmail.com
      password: 123456
    `
    );
    process.exit();
  }
);
