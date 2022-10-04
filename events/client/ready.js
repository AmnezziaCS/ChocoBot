module.exports = (client) => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setActivity("Manger du chocolat");
  client.user.setStatus("idle");
};
