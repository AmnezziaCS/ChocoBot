function newDate(date) {
  let i = 0;
  date
    .toString()
    .split("")
    .forEach((element) => {
      if (element === "G") {
        date = date.toString().substring(0, i);
      }
      i++;
    });
  return date;
}

module.exports = newDate;
