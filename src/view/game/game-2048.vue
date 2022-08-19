<template>
  <div class="container">
      <nav>
        <h1>2048</h1>
        <div class="score">
          <div class="now">
            <span class="label">SCORE</span>
            <span class="value">{{score}}</span>
          </div>
          <div class="best">
            <span class="label">BEST</span>
            <span class="value">{{bestScore}}</span>
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
        <div class="tile-container">
        </div>
      </main>
      <footer>
        <!-- <img src="./images/logo.png" /> -->
        <span>2048 by &copy; NULL</span>
      </footer>
      <div class="mask status">
        <div class="content">Game Over!</div>
        <button @click="newGame">Try again</button>
      </div>
    </div>
</template>

<script>
export default {
  data(){
    return {
         score: 0,  //当前游戏的分数
         bestScore: 0,  //历史最佳分数
      };
  },
  created(){
    //监听键盘事件
    this.keyDown();
  },
  mounted(){
        
  },
  beforeDestroy(){
    //组件销毁前解绑键盘监听事件
    this.removeKeyDown();
  },
  destroyed(){
        
  },
  methods: {
     //绑定键盘事件
     keyDown () {
      console.log("绑定键盘监听");
      //监听键盘按钮
      document.onkeydown = function (event) {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;
        switch (keyCode) {
          case 38:
          // moveFn({ row: -1, column: 0 });
          console.log("上");
          break;
          case 37:
          // moveFn({ row: 0, column: -1 });
          console.log("左");
          break;
          case 39:
          // moveFn({ row: 0, column: 1 });
          console.log("右");
          break;
          case 40:
          // moveFn({ row: 1, column: 0 });
          console.log("下");
          break;
          default:
          break;
        }
        if (e && e.preventDefault) {
          e.preventDefault();
        } else {
          window.event.returnValue = false;
        }
      }
    },
    //取消绑定键盘事件
    removeKeyDown(){
      console.log("解绑键盘监听");
       document.onkeydown = function (event) {
        var e = event || window.event;
        e.returnValue = true;
      }
    },
    //开始新游戏
    newGame(){
      console.log("开始新游戏");
    },
  },
  computed: {
        
  },
  watch: {
        
  }
};
</script>

<style lang="scss" scoped>
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
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
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


$field-width: 290px;
$grid-spacing: 10px;
$grid-row-cells: 4;
$tile-size: ($field-width - $grid-spacing * ($grid-row-cells + 1)) / $grid-row-cells;
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

</style>