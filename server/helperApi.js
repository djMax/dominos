import Router from 'koa-router';
import koaBody from 'koa-body';

export default function addHelpers({ app }) {
  const { db } = app.context;
  const router = new Router();

  router.post('/games/:name/:id/getHand', koaBody(), async ctx => {
    const gameName = ctx.params.name;
    const gameID = ctx.params.id;
    const { playerID, credentials } = ctx.request.body;

    const gameMetadata = await db.get(`${gameName}:${gameID}:metadata`);
    const gameState = await db.get(`${gameName}:${gameID}`);

    if (gameMetadata.players[playerID].credentials !== credentials) {
      ctx.throw(403, 'Invalid credential');
    }

    ctx.body = {
      hand: gameState.G.players[playerID].hand.map(p => p.values),
    };
  });

  app.use(router.routes()).use(router.allowedMethods());
}
