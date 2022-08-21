<template>
  <div class="container">
    <nav>
      <h1>2048</h1>
      <div class="score">
        <div class="now">
          <span class="label">SCORE</span>
          <span class="value">{{ score }}</span>
        </div>
        <div class="best">
          <span class="label">BEST</span>
          <span class="value">{{ bestScore }}</span>
        </div>
      </div>
    </nav>
    <div class="desc">
      <button @click="newGame">New Game</button>
    </div>
    <main>
      <div class="game-grid">
        <div class="grid-row">
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
        </div>
        <div class="grid-row">
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
        </div>
        <div class="grid-row">
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
        </div>
        <div class="grid-row">
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
          <div class="grid-cell"></div>
        </div>
      </div>
      <div class="tile-container" ref="tileContainer">
      </div>
    </main>
    <footer>
      <!-- <img src="./images/logo.png" /> -->
      <span>2048 by &copy; NULL</span>
    </footer>
    <div class="mask status" ref="statusContainer">
      <div class="content" ref="content">Game Over!</div>
      <button @click="newGame">Try again</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      score: 0, //当前游戏的分数
      bestScore: 0, //历史最佳分数
      status: "DOING", //当前游戏的状态
      BestScoreKey: "2048BestScore", //历史最佳字段名
      CellStateKey: "2048CellState", //方格状态和分数字段名
      size: 4, //游戏默认的grid行列数， 4 * 4
      aim: 2048,
      grid: null,
      cells: [],
    };
  },
  created() {},
  mounted() {
    //监听键盘事件
    this.keyDown();
  },
  beforeDestroy() {
    //组件销毁前解绑键盘监听事件
    this.removeKeyDown();
  },
  destroyed() {},
  methods: {
    //绑定键盘事件
    keyDown() {
      console.log("绑定键盘监听");
      const self = this;
      //监听键盘按钮
      document.onkeydown = function (event) {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;
        switch (keyCode) {
          case 38:
            self.move({ row: -1, column: 0 });
            break;
          case 37:
            self.move({ row: 0, column: -1 });
            break;
          case 39:
            self.move({ row: 0, column: 1 });
            break;
          case 40:
            self.move({ row: 1, column: 0 });
            break;
          default:
            break;
        }
        if (e && e.preventDefault) {
          e.preventDefault();
        } else {
          window.event.returnValue = false;
        }
      };
    },
    //取消绑定键盘事件
    removeKeyDown() {
      console.log("解绑键盘监听");
      document.onkeydown = function (event) {
        var e = event || window.event;
        e.returnValue = true;
      };
    },
    //开始新游戏
    newGame() {
      this.score = 0;
      this.status = "DOING";
      this.grid = this.gridInit(this.size);
      for (let i = 0; i < 2; i++) {
        //初始化
        this.addRandomTile();
      }
      this.renderGame();
    },
    //随机添加一个节点
    addRandomTile() {
      const position = this.getRandomAvailableCell();
      if (position) {
        // 90%概率为2，10%为4
        const value = Math.random() < 0.9 ? 2 : 4;
        // 随机一个方格的位置
        const position = this.getRandomAvailableCell();
        // 添加到grid中
        this.addTile(this.initTile(position, value));
      }
    },
    //本地存储历史最佳分数
    setBestScore(bestScore) {
      localStorage.setItem(this.BestScoreKey, bestScore);
    },
    //获取本地存储中历史最佳分数
    getBestScore() {
      return localStorage.getItem(this.BestScoreKey);
    },
    //本地存储当前游戏的方格状态
    setCellState({ score, grid }) {
      localStorage.setItem(
        this.CellStateKey,
        JSON.stringify({
          score,
          grid: this.getGridSerialize(),
        })
      );
    },
    //获取本地存储中的方格状态
    getCellState() {
      const cellState = localStorage.getItem(CellStateKey);
      return cellState ? JSON.parse(cellState) : null;
    },
    //渲染grid
    renderGrid(grid, { score, status, bestScore }) {
      //清空grid
      this.empty();
      //设置当前游戏分数
      this.score = score;
      //设置历史最佳分数
      this.bestScore = bestScore;
      //设置当前游戏状态
      this.renderStatus(status);
      //遍历grid渲染到页面
      for (let row = 0; row < this.size; row++) {
        for (let column = 0; column < this.size; column++) {
          //如果grid数组中的某一个cell不为空，则渲染到页面上
          if (this.cells[row][column]) {
            this.renderTile(this.cells[row][column]);
          }
        }
      }
    },
    //清空grid
    empty() {
      this.$refs.tileContainer.innerHTML = "";
    },
    //设置游戏当前状态
    renderStatus(status) {
      const statusContainer = this.$refs.statusContainer;
      if (status === "DOING") {
        statusContainer.style.display = "none";
        return;
      }
      statusContainer.style.display = "flex";
      statusContainer.querySelector(".content").innerHTML =
        status === "WIN" ? "You Win!" : "Game Over!";
    },
    //渲染单个tile
    renderTile(tile) {
      // 创建一个tile-inner
      const tileInner = document.createElement("div");
      tileInner.setAttribute("class", "tile-inner");
      tileInner.innerHTML = tile.value;
      // 创建一个tile
      const tileDom = document.createElement("div");
      let classList = [
        "tile",
        `tile-${tile.value}`,
        `tile-position-${tile.row + 1}-${tile.column + 1}`,
      ];
      if (tile.prePosition) {
        // 先设置之前的位置
        classList[2] = `tile-position-${tile.prePosition.row + 1}-${
          tile.prePosition.column + 1
        }`;
        // 延迟设置当前的位置
        setTimeout(function () {
          classList[2] = `tile-position-${tile.row + 1}-${tile.column + 1}`;
          tileDom.setAttribute("class", classList.join(" "));
        }, 16);
      } else if (tile.mergedTiles) {
        classList.push("tile-merged");
        //如果有mergedTiles，则渲染mergedTile的两个Tile
        tileDom.setAttribute("class", classList.join(" "));
        for (let i = 0; i < tile.mergedTiles.length; i++) {
          this.renderTile(tile.mergedTiles[i]);
        }
      } else {
        classList.push("tile-new");
      }
      tileDom.setAttribute("class", classList.join(" "));
      tileDom.appendChild(tileInner);
      this.$refs.tileContainer.appendChild(tileDom);
    },
    //游戏初始化
    initGame() {
      //获取本地存储中的游戏状态
      const state = this.getCellState();
      //获取本地存储中的历史最佳分数
      let bestScore = this.getBestScore();
      if (!bestScore) {
        //如果本地存储中不存在则历史最佳分数设置为0
        bestScore = 0;
      }
      this.bestScore = bestScore;
      //如果本地存储中存在有游戏信息，则恢复
      if (state) {
        this.score = state.score;
        this.status = "DOING";
        //恢复grid信息
        this.grid = this.gridInit(this.size, state.grid);
        //根据grid信息渲染页面
        this.renderGame();
      } else {
        this.newGame();
      }
    },
    //渲染游戏画面
    renderGame() {
      // 渲染之前调用存储
      this.setCellState({ score: this.score, grid: this.grid });
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        this.setBestScore(this.bestScore);
      }
      this.renderGrid(this.grid, {
        score: this.score,
        status: this.status,
        bestScore: this.bestScore,
      });
    },
    //初始化grid信息
    gridInit(size = 4, state) {
      //如果本地存储有游戏的进度，则恢复
      if (state) {
        this.recoverGame(state);
      } else {
        //重新初始化全新的cells
        this.initCells(this.size);
      }
    },
    //初始化cells-动态创建二维数组
    initCells(size) {
      this.size = size;
      this.cells = [];
      for (let row = 0; row < size; row++) {
        this.cells.push([]);
        for (let column = 0; column < size; column++) {
          this.cells[row].push(null);
        }
      }
    },
    //恢复游戏进度
    recoverGame({ size, cells }) {
      this.size = size;
      //遍历cells二维数组
      for (let row = 0; row < this.size; row++) {
        for (let column = 0; column < this.size; column++) {
          const cell = cells[row][column];
          if (cell) {
            this.cells[row][column] = this.initTile(cell.position, cell.value);
          }
        }
      }
    },
    //初始化grid中每一个tile实例对象
    initTile(position, value) {
      let tile = {
        row: position.row,
        column: position.column,
        value: value,
        prePosition: null,
        mergedTiles: null,
      };
      return tile;
    },
    //修改tile位置
    updataTilePosition(tile, position) {
      // 更新的时候，先将当前tile的位置，保存为prePosition
      tile.prePosition = { row: tile.row, column: tile.column };
      tile.row = position.row;
      tile.column = position.column;
    },
    //获取tile的数据
    getTileserialize(tile) {
      return {
        position: {
          row: tile.row,
          column: tile.column,
        },
        value: tile.value,
      };
    },
    //添加tile
    addTile(tile) {
      this.cells[tile.row][tile.column] = tile;
    },
    //移除tile
    removeTile(tile) {
      this.cells[tile.row][tile.column] = null;
    },
    //获取所有可用的cells
    getAvailableCells() {
      const availableCells = [];
      for (let row = 0; row < this.cells.length; row++) {
        for (let column = 0; column < this.cells[row].length; column++) {
          // 如果当前方格没有内容，则其可用（空闲）
          if (!this.cells[row][column]) {
            availableCells.push({ row, column });
          }
        }
      }
      return availableCells;
    },
    //随机获取某个可用方格的位置
    getRandomAvailableCell() {
      // 获取到所有的空闲方格
      const cells = this.getAvailableCells();
      if (cells.length > 0) {
        // 利用Math.random()随机获取其中的某一个
        return cells[Math.floor(Math.random() * cells.length)];
      }
    },
    //获取某个位置的tile
    getTileInfo(position) {
      if (this.outOfRange(position)) {
        return null;
      }
      return this.cells[position.row][position.column];
    },
    //判断当前的position是否越界
    outOfRange(position) {
      return (
        position.row < 0 ||
        position.row >= this.size ||
        position.column < 0 ||
        position.column >= this.size
      );
    },
    //获取Grid的数据
    getGridSerialize() {
      const cellState = [];
      // cellState 是一个二维数组，分别存储整个Grid信息。
      // 如果该位置有Tile, 则返回 Tile序列化结果
      // 如果该位置没有Tile，则存储null
      for (let row = 0; row < this.size; row++) {
        cellState[row] = [];
        for (let column = 0; column < this.size; column++) {
          let tile = this.cells[row][column];
          if (tile !== null) {
            cellState[row].push(this.getTileserialize(tile));
          } else {
            cellState[row].push(null);
          }
        }
      }
      return {
        size: this.size,
        cells: cellState,
      };
    },
    //方块的移动逻辑
    move(direction) {
      // 定义一个变量，判断是否引起移动
      let moved = false;
      const { rowPath, columnPath } = this.getPaths(direction);
      for (let i = 0; i < rowPath.length; i++) {
        for (let j = 0; j < columnPath.length; j++) {
          const position = { row: rowPath[i], column: columnPath[j] };
          const tile = this.getTileInfo(position);
          if (tile) {
            // 当此位置有Tile的时候才进行移动
            const { aim, next } = this.getNearestAvaibleAim(
              position,
              direction
            );

            // 区分合并和移动，当next值和tile值相同的时候才进行合并
            if (next && next.value === tile.value) {
              // 合并位置是next的位置，合并的value是tile.value * 2
              const merged = this.initTile(
                {
                  row: next.row,
                  column: next.column,
                },
                tile.value * 2
              );
              this.score += merged.value;
              //将合并以后节点，加入grid
              this.addTile(merged);
              //在grid中删除原始的节点
              this.removeTile(tile);
              //判断游戏是否获胜
              if (merged.value === this.aim) {
                this.status = "WIN";
              }
              merged.mergedTiles = [tile, next];
              this.updataTilePosition(tile, {
                row: next.row,
                column: next.column,
              });
              moved = true;
            } else {
              this.moveTile(tile, aim);
              moved = true;
            }
          }
        }
      }
      // 移动以后进行重新渲染
      if (moved) {
        this.addRandomTile();
        if (this.checkFailure()) {
          this.status = "FAILURE";
        }
        this.renderGame();
      }
    },
    // 根据方向，确定遍历的顺序
    getPaths(direction) {
      let rowPath = [];
      let columnPath = [];
      for (let i = 0; i < this.size; i++) {
        rowPath.push(i);
        columnPath.push(i);
      }
      // 向右的时候
      if (direction.column === 1) {
        columnPath = columnPath.reverse();
      }
      // 向下的时候
      if (direction.row === 1) {
        rowPath = rowPath.reverse();
      }
      return {
        rowPath,
        columnPath,
      };
    },
    // 寻找移动方向目标位置
    getNearestAvaibleAim(aim, direction) {
      // 位置 + 方向向量的计算公式
      function addVector(position, direction) {
        return {
          row: position.row + direction.row,
          column: position.column + direction.column,
        };
      }
      aim = addVector(aim, direction);
      // 获取grid中某个位置的元素
      let next = this.getTileInfo(aim);
      // 如果next元素存在（也就是此目标位置已经有Tile），或者是超出游戏边界，则跳出循环。目的：就是找到最后一个空白且不超过边界的方格
      while (!this.outOfRange(aim) && !next) {
        aim = addVector(aim, direction);
        next = this.getTileInfo(aim);
      }
      // 这时候的aim总是多计算了一步，因此我们还原一下
      aim = {
        row: aim.row - direction.row,
        column: aim.column - direction.column,
      };
      return {
        aim,
        next,
      };
    },
    //移动tile
    moveTile(tile, aim) {
      this.cells[tile.row][tile.column] = null;
      this.updataTilePosition(tile, aim);
      this.cells[aim.row][aim.column] = tile;
    },
    // 判断游戏是否失败
    checkFailure() {
      // 获取空白的Cell
      const emptyCells = this.getAvailableCells();
      // 如果存在空白，则游戏肯定没有失败
      if (emptyCells.length > 0) {
        return false;
      }
      for (let row = 0; row < this.size; row++) {
        for (let column = 0; column < this.size; column++) {
          let now = this.getTileInfo({ row, column });
          // 根据4个方向，判断临近的Tile的Value值是否相同
          let directions = [
            { row: 0, column: 1 },
            { row: 0, column: -1 },
            { row: 1, column: 0 },
            { row: -1, column: 0 },
          ];
          for (let i = 0; i < directions.length; i++) {
            const direction = directions[i];
            const next = this.getTileInfo({
              row: row + direction.row,
              column: column + direction.column,
            });
            // 判断Value是否相同
            if (next && next.value === now.value) {
              return false;
            }
          }
        }
      }
      return true;
    },
  },
  computed: {},
  watch: {},
};
</script>

<style lang="scss">
// index.scss
p {
  padding: 0;
  margin: 0;
}

button {
  cursor: pointer;
  &:focus {
    outline: none;
  }
}

.body {
  margin: 0;
  padding: 0;
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
  color: #776e65;
}

.container {
  position: relative;
  width: 375px;
  height: 667px;
  position: fixed;
  background-color: #faf8ef;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

footer {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-top: 78px;

  img {
    width: 100px;
    height: 36px;
  }

  span {
    margin-left: 16px;
    font-size: 14px;
    color: #8f7a67;
    font-weight: 500;
  }
}

.mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.4);

  .content {
    font-family: Arial-Black;
    font-size: 26px;
    color: #8f7a67;
    text-align: center;
  }

  button {
    margin-top: 20px;
    width: 98px;
    height: 44px;
    background: #8f7a67;
    border-radius: 4px;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    font-family: Arial-Black;
    font-weight: 700;
    line-height: 44px;
  }
}

//desc.scc
.desc {
  display: flex;
  padding: 0 42px;
  align-items: center;

  p {
    font-size: 15px;
    color: #635545;
    flex: 1;
  }

  button {
    margin: 0;
    padding: 0;
    width: 98px;
    height: 44px;
    border-radius: 4px;
    background-color: #8f7a66;
    font-size: 14px;
    color: #fff;
    line-height: 44px;
    text-align: center;
    font-weight: 700;
    font-family: Arial-Black;
  }
}

//main.scss
$field-width: 290px;
$grid-spacing: 10px;
$grid-row-cells: 4;
$tile-size: ($field-width - $grid-spacing * ($grid-row-cells + 1)) /
  $grid-row-cells;
$tile-border-radius: 3px;

main {
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  width: $field-width;
  height: $field-width;
  position: relative;
  padding: $grid-spacing;
  background: #bbada0;
  border-radius: 8px;

  .game-grid {
    .grid-row {
      margin-bottom: $grid-spacing;
      display: flex;

      .grid-cell {
        width: $tile-size;
        height: $tile-size;
        margin-right: $grid-spacing;
        float: left;
        border-radius: 3px;
        background: rgba(238, 228, 218, 0.35);

        &:last-child {
          margin-right: 0;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .tile-container {
    position: absolute;
    left: 0;
    top: 0;

    .tile {
      position: absolute;
      width: $tile-size;
      height: $tile-size;
      border-radius: 4px;
      transition: transform 100ms ease-in-out;
    }

    .tile-inner {
      width: 100%;
      height: 100%;
      line-height: $tile-size;
      background: #eee4da;
      text-align: center;
      font-weight: bold;
      font-size: 34px;
      color: #776e65;
    }

    @for $x from 1 through $grid-row-cells {
      @for $y from 1 through $grid-row-cells {
        .tile-position-#{$x}-#{$y} {
          $xPos: $grid-spacing + floor(($tile-size + $grid-spacing) * ($y - 1));
          $yPos: $grid-spacing + floor(($tile-size + $grid-spacing) * ($x - 1));
          transform: translate($xPos, $yPos);
        }
      }
    }

    .tile-merged .tile-inner {
      z-index: 20;
      animation: pop 200ms ease 100ms;
      animation-fill-mode: backwards;
    }

    .tile-new .tile-inner {
      animation: appear 200ms ease-in-out;
      animation-delay: 100ms;
      animation-fill-mode: backwards;
    }

    .tile.tile-2 .tile-inner {
      background: #eee4da;
    }
    .tile.tile-4 .tile-inner {
      background: #ede0c8;
    }
    .tile.tile-8 .tile-inner {
      color: #f9f6f2;
      background: #f2b179;
    }
    .tile.tile-16 .tile-inner {
      color: #f9f6f2;
      background: #f59563;
    }
    .tile.tile-32 .tile-inner {
      color: #f9f6f2;
      background: #f67c5f;
    }
    .tile.tile-64 .tile-inner {
      color: #f9f6f2;
      background: #f65e3b;
    }
    .tile.tile-128 .tile-inner {
      color: #f9f6f2;
      background: #edcf72;
      font-size: 30px;
    }

    .tile.tile-256 .tile-inner {
      color: #f9f6f2;
      background: #edcc61;
      font-size: 30px;
    }

    .tile.tile-512 .tile-inner {
      color: #f9f6f2;
      background: #edc850;
      font-size: 30px;
    }

    .tile.tile-1024 .tile-inner {
      color: #f9f6f2;
      background: #edc53f;
      font-size: 22px;
    }

    .tile.tile-2048 .tile-inner {
      color: #f9f6f2;
      background: #edc22e;
      font-size: 22px;
    }
  }
}

@keyframes appear {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pop {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

//nav.scss
nav {
  height: 68px;
  padding: 30px 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 0;
    font-size: 34px;
    font-weight: 700px;
    color: #635545;
  }
  .score {
    display: flex;
    > div {
      width: 68px;
      height: 68px;
      margin-left: 10px;
      border-radius: 6px;
      background-color: #bbada0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .label {
        font-size: 15px;
        font-weight: bold;
        color: #eee4d9;
      }

      .value {
        font-size: 28px;
        font-weight: 700;
        color: #ffffff;
      }
    }
  }
}
</style>