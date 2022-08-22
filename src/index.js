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

  let knighthistory = [];

  const getTree = function (
    root,
    to,
    stack = [movesGraph[root.coordinates[1] * 8 + root.coordinates[0]]],
    discoveredNodes = [],
    history = [],
  ) {
    const graphIndex = stack[0].coordinates[1] * 8 + stack[0].coordinates[0];
    discoveredNodes.push(movesGraph[graphIndex]);
    movesGraph[graphIndex].childNodes.map((coordinate, index) => {
      if (!discoveredNodes.includes(coordinate)) {
        stack.push(coordinate);
      } else movesGraph[graphIndex].childNodes.splice(index, 1);
    });

    stack.shift();

    if (stack.length === 0) {
      return movesGraph[root.coordinates[1] * 8 + root.coordinates[0]];
    }
    return getTree(root, to, stack, discoveredNodes, history);
  };
  const root = getTree(Node(from[0], from[1]), to);
};

knightMoves([0, 0], [5, 0]);
