const { net } = require("web3");
const { IntegrationProject } = require("../models");
const crypto = require("crypto");

function generateApiKey() {
  return crypto.randomBytes(32).toString("hex");
}

exports.render = function (req, res) {
  res.render("integration_detail", {});
};

exports.addIntegration = async function (req, res) {
  const integrationKey = generateApiKey();
  try {
    console.log(req.body);
    let networksArr = [];
    if(req.body.network_1) {
      networksArr.push(5010);
    }
    if(req.body.network_2) {
      networksArr.push(3010);
    }
    if(req.body.network_3) {
      networksArr.push(1010);
    }
    const integration = await IntegrationProject.create({
      name: req.body.projectname,
      description: req.body.description,
      domain: req.body.domain,
      webhook: req.body.webhook,
      user_id: req.user.id,
      integration_key: integrationKey,
      network: networksArr
    });
    res.send(integration.toJSON());
  } catch (err) {
    res.status(500).send({
      error: "There is some problem creating integration.",
    });
  }
};

exports.getIntegrations = function (req, res, next) {
  IntegrationProject.findAll({
    where: {
      user_id: req.user.id,
    },
  })
    .then((integrations) => {
      req.integrations = integrations;
      res.locals.integrations = integrations;
      next();
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getExactIntegration = function (req, res, next) {
  IntegrationProject.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((integration) => {
      if (!integration) {
        return next(new Error("Integration not found"));
      }
      req.exact_integration = integration;
      res.locals.exact_integration = integration;
      next();
    })
    .catch((err) => {
      return next(err);
    });
};
