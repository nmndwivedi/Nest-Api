import { SignupDTO } from './../src/auth/dto/signup.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDTO } from 'src/auth/dto/editUser.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  async function cleanDb() {
    await prisma.user.deleteMany({});
    await prisma.bookmark.deleteMany({});
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl('http://localhost:3333');

    await cleanDb();
  });

  beforeEach(async () => {});

  afterAll(async () => {
    await app.close();
  });

  let body: SignupDTO = {
    email: 'nmndwivedi@gmail.com',
    password: 'helols',
    firstName: 'Niranjan',
    lastName: 'Mendwivedi',
  };

  let editbody: EditUserDTO = {
    firstName: 'Norsusao',
    lastName: 'Mendwivedi',
  };

  describe('auth', () => {
    describe('signup', () => {
      describe('error cases', () => {
        it('no body', () => {
          return pactum.spec().post('/auth/signup').expectStatus(400);
        });

        it('no password in Body', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .withBody({ email: body.email })
            .expectStatus(400);
        });
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(body)
          .expectStatus(201);
      });
    });

    describe('login', () => {
      describe('error cases', () => {
        it('no body', () => {
          return pactum.spec().post('/auth/login').expectStatus(400);
        });

        it('no password in Body', () => {
          return pactum
            .spec()
            .post('/auth/login')
            .withBody({ email: body.email })
            .expectStatus(400);
        });
      });

      it('should login', async () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(body)
          .expectStatus(200)
          .stores('token', 'access_token');
      });
    });
  });

  describe('user', () => {
    describe('get me', () => {
      it('should get user', async () => {
        await pactum
          .spec()
          .get('/users/me')
          .expectStatus(HttpStatus.UNAUTHORIZED);
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders('Authorization', 'Bearer $S{token}')
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('edit me', () => {
      it('should fail to edit w/o access token', () => {
        return pactum
          .spec()
          .patch('/users/me')
          .withBody(editbody)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should edit w access token', () => {
        return pactum
          .spec()
          .patch('/users/me')
          .withHeaders('Authorization', 'Bearer $S{token}')
          .withBody(editbody)
          .expectStatus(HttpStatus.OK)
          .expectJsonMatch(editbody);
      });
    });
  });

  describe('bookmark', () => {
    describe('create one for user', () => {
      it('should create bookmark', async () => {
        return pactum
          .spec()
          .post('/bookmarks/create')
          .withHeaders('Authorization', 'Bearer $S{token}')
          .withBody({
            url: 'https://www.google.com',
            title: 'Google',
          })
          .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('get all for user', () => {
      it ("should fail to get all bookmars", () => {
        return pactum.spec().get('/bookmarks').expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it ("should get all bookmars", () => {
        return pactum.spec().get('/bookmarks').withHeaders('Authorization', 'Bearer $S{token}').expectStatus(HttpStatus.OK).expectBodyContains('https://www.google.com').stores('bookmarkId', 'id');
      });
    });

    describe('get by id for user', () => {
      it ("should get", () => {
        return pactum.spec().get('/bookmarks').withPathParams('id', 'Bearer $S{bookmarkId}').withHeaders('Authorization', 'Bearer $S{token}').expectStatus(HttpStatus.OK).expectBodyContains('https://www.google.com');
      });
    });

    describe('edit', () => {

    });

    describe('delete', () => {

    });
  });

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });
});
