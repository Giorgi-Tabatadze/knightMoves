const { node } = require("webpack");

const knightMoves = function (from, to) {
  const board = [];

  const Node = function (x, y) {
    let coordinates = [x, y];
    let childNodes = [];

    return { coordinates, childNodes };
  };

  const newMove = function (currentCoordinate, offset) {
    if (
      currentCoordinate[0] + offset[0] < 0 ||
      currentCoordinate[0] + offset[0] > 7 ||
      currentCoordinate[1] + offset[1] < 0 ||
      currentCoordinate[1] + offset[1] > 7
    ) {
      return false;
    } else {
      return [
        currentCoordinate[0] + offset[0],
        currentCoordinate[1] + offset[1],
      ];
    }
  };

  const knightOffsets = [
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
    [-2, 1],
    [-1, 2],
  ];

  const createBoardList = function (x = 0, y = 0, boardList = []) {
    const coordinateToAdd = Node(x, y);
    boardList.push(coordinateToAdd);
    if (x < 7) {
      x += 1;
    } else {
      x = 0;
      if (y < 7) {
        y += 1;
      } else {
        return boardList;
      }
    }
    const boardToReturn = createBoardList(x, y, boardList);
    return boardToReturn;
  };

  const addPossibleMoves = function (
    stack = createBoardList(),
    possibleMoves = createBoardList(),
  ) {
    if (stack.length === 0) {
      return possibleMoves;
    }
    knightOffsets.forEach((offset) => {
      const newCoordinate = newMove(stack[0].coordinates, offset);
      if (newCoordinate) {
        possibleMoves[
          stack[0].coordinates[1] * 8 + stack[0].coordinates[0]
        ].childNodes.push(
          possibleMoves[newCoordinate[1] * 8 + newCoordinate[0]],
        );
      }
    });
    stack.shift();
    const listToReturn = addPossibleMoves(stack, possibleMoves);
    return listToReturn;
  };
  let movesGraph = addPossibleMoves();

  const getTree = function (
    from,
    to,
    stack = [movesGraph[from[1] * 8 + from[0]]],
    discoveredNodes = [movesGraph[from[1] * 8 + from[0]].coordinates],
  ) {
    const graphIndex = stack[0].coordinates[1] * 8 + stack[0].coordinates[0];

    const newChildnodes = [];
    movesGraph[graphIndex].childNodes.forEach((coordinate) => {
      if (
        !discoveredNodes.some((disCor) => {
          return (
            disCor[0] === coordinate.coordinates[0] &&
            disCor[1] === coordinate.coordinates[1]
          );
        })
      ) {
        discoveredNodes.push(coordinate.coordinates);
        stack.push(coordinate);
        newChildnodes.push(coordinate);
      }
    });

    movesGraph[graphIndex].childNodes = [...newChildnodes];

    stack.shift();

    if (stack.length === 0) {
      return;
    }
    return getTree(from, to, stack, discoveredNodes);
  };
  getTree(from, to);
  const root = movesGraph[from[1] * 8 + from[0]];

  const depthSearch = function (currentNode, lookFor, history = []) {
    const ourHistory = [...history];

    if (
      currentNode.coordinates[0] === lookFor[0] &&
      currentNode.coordinates[1] === lookFor[1]
    ) {
      ourHistory.push(currentNode.coordinates);
      return ourHistory;
    }
    if (currentNode.childNodes.length === 0) {
      return false;
    }
    for (const childNode of currentNode.childNodes) {
      const historyToReturn = depthSearch(childNode, lookFor, [
        ...ourHistory,
        currentNode.coordinates,
      ]);
      if (historyToReturn) {
        return historyToReturn;
      }
    }
  };
  const movesMade = depthSearch(root, to);
  let textToReturn = `You made ${movesMade.length - 1} moves`;
  movesMade.forEach((move) => {
    textToReturn += ` => [${move[0]}, ${move[1]}]`;
  });
  return textToReturn;
};

console.log(knightMoves([0, 0], [5, 0]));
console.log(knightMoves([3, 7], [1, 6]));
console.log(knightMoves([3, 7], [0, 0]));
