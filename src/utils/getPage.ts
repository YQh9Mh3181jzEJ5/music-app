export const getPageNumbers = (current: number, total: number) => {
  const numbers = [];
  const delta = 1;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 || // 最初のページ
      i === total || // 最後のページ
      (i >= current - delta && i <= current + delta) // 現在のページの前後
    ) {
      numbers.push(i);
    } else if (numbers[numbers.length - 1] !== "...") {
      numbers.push("...");
    }
  }

  if (numbers[numbers.length - 1] !== total) {
    if (numbers[numbers.length - 1] !== "...") {
      numbers.push("...");
    }
    numbers.push(total);
  }

  return numbers;
};
