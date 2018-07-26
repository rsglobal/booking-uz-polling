function trainToString(train) {
  return `🚂${train.from.date}:${train.num}:${train.types
    .map(t => t.letter + t.places)
    .join(",")}`;
}

function resultToString(result) {
  const data = result.data;

  if (!data) {
    return JSON.stringify(result);
  }

  if (!data.list || !data.list.length) {
    return data.warning || JSON.stringify(data);
  }

  return (
    data.list
      .filter(train => train.types.length > 0)
      .map(train => trainToString(train))
      .join("; ") || "☹️ NO PLACES"
  );
}

export default resultToString;
