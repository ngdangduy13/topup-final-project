import * as express from 'express';
import * as next from 'next';
import * as morgan from 'morgan';
import Authorize from './middlewares/authorize';
import isTokenValid from '../api/core/helpers/token-check';
import config from '../configs';
const setupNextjsRoutes = (server: express.Express, app: next.Server) => {
    const handle = app.getRequestHandler();

    server.get('/_next/*', (req, res) => {
        return handle(req, res);
    });
    server.get('/static/*', (req, res) => {
        return handle(req, res);
    });
};

const setupPublicRoutes = (server: express.Express, app: next.Server) => {
    server.use(morgan('short'));

    server.get('/', async (_req, res) => {
        res.redirect('/admin/users');
    });
    server.get('/admin/login', async (req: any, res) => {
        const isUserAuthorized = await isTokenValid(req.cookies.token, config.roles.admin);
        if (!isUserAuthorized) {
            app.render(req, res, '/admin/login', req.query);
        } else {
            res.redirect('/admin/users');
        }
    });
    server.get('/admin/users', Authorize([config.roles.admin], true), async (req, res) => {
        app.render(req, res, '/admin/users', req.query);
    });
    server.get('/admin', async (_req, res) => {
        res.redirect('/admin/users');
    });
};

const bootstrapNextjs = async (server: express.Express) => {
    const dev = process.env.NODE_ENV !== 'production';
    const app = next({ dev });
    await app.prepare();

    setupNextjsRoutes(server, app);
    setupPublicRoutes(server, app);
};

export { bootstrapNextjs };
