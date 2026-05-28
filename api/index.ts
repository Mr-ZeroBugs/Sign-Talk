import app, { appSetup } from "../server/index";

export default async (req: any, res: any) => {
    await appSetup;
    return app(req, res);
};
