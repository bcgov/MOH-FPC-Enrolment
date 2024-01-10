<template>
    <nav>
      <div class="step-container">
        <div class="row">
          <div class="col-md-6 p-3">
            <div v-if="currentStepNumber != 1" >
              <a class="back-button chevron-left"
                href="javascript:void(0);"
                @click="onClickLink(previousPath)"
              >
              <IconChevronSingleLeft /> Back
              </a>
            </div>
          </div>
          <div class="col-md-6 p-3">
            <p class="step">Step {{ currentStepNumber }} of {{ routes.length }}</p>
            <p class="step">{{ currentStepTitle }}</p>
          </div>
        </div>
      </div>
      <div class="mobile-step-container p-3 border-bottom">
        <div class="row">
          <div class="col-sm-6">
            <div v-if="currentStepNumber != 1" >
              <a class="back-button chevron-left"
                href="javascript:void(0);"
                @click="onClickLink(previousPath)"
              >
              <IconChevronSingleLeft /> Back
              </a>
            </div>
          </div>
          <div class="col-sm-6">
            <p class="step">Step {{ currentStepNumber }} of {{ routes.length }}</p>
            <p class="step">{{ currentStepTitle }}</p>
          </div>
        </div>
      </div>
    </nav>
</template>
  
<script>
import IconChevronSingleLeft from '../assets/IconChevronSingleLeft.vue';

export default {
    name: "ProgressBar",
    components: {
      IconChevronSingleLeft,
    },
    props: {
      currentPath: String,
      routes: Array
    },
    computed: {
      progressBarStyles() {
        const index = this.routes.findIndex(element => {
          return element.path === this.currentPath;
        });
        return {
          width:
            (100 / this.routes.length) * index +
            100 / this.routes.length / 2 +
            "%"
        };
      },
      verticalProgressBarStyles() {
        const index = this.routes.findIndex(element => {
          return element.path === this.currentPath;
        });
        return {     
          height: index / (this.routes.length - 1) * 100 + "%"
        };
      },
      previousPath() {
        const index = this.routes.findIndex(element => {
          return element.path.includes(this.currentPath);
        });
        return this.routes[index-1].path;
      },
      currentStepNumber() {
        const index = this.routes.findIndex(element => {
          return element.path.includes(this.currentPath);
        });
        return index + 1;
      },
      currentStepTitle() {
        const index = this.routes.findIndex(element => {
          return element.path.includes(this.currentPath);
        });
        return this.routes[index].title;
      }
    },
    methods: {
        onClickLink: function(path) {
            this.$router.push(path);
        },
    }
  };
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .component-container {
    flex: 1;
    padding: 1em 0;
    min-height: 2em;
    margin-top: 0;
    background: #f2f2f2;
    /* min-width: 650px; */
  }
  
  @media (min-width: 481px) {
    .component-container {
      margin-top: 24px;
    }
  }
  
  .progress-bar-container {
    background-color: #606060;
    border-radius: 0.25rem;
    transform: translateY(-2px);
    height: 0.25rem;
  }
  .progress-bar {
    height: 100%;
    border-radius: 0.25rem;
    background: #036;
  }
  .step-container {
    padding: 0 1em;
    background: #f4f4f4;
  }
  .step {
    display: flex;
    justify-content: right;
    margin-bottom: 0;
    font-weight: bolder;
  }
  .back-button{
    display: flex;
    justify-content: left;
    padding: 0 1em;
    font-weight: bolder;
  }
  .chevron-left {
    width: 85px;
  }
  /* .step {
    position: relative;
    -webkit-transform: translateX(-0.5em);
    transform: translateX(-0.5em);
    margin-top: 0.25rem;
    cursor: default;
  } 
  .step:before {
    content: " ";
    position: absolute;
    width: 1em;
    height: 1em;
    border-radius: 100%;
    background: #fff;
    border: 2px solid #606060;
    right: 0;
    left: 0;
    margin: 0 auto;
    bottom: 100%;
  }
  .step-selected:before {
    border: 2px solid #036;
  }
  .step-passed {
    cursor: pointer;
  }
  .step-passed:before {
    border: 2px solid #036;
    background: #036;
  }
  .step-text {
    position: absolute;
    -webkit-transform: translateX(-37%);
    transform: translateX(-37%);
    white-space: nowrap;
    color: #494949;
    font-weight: normal;
  }
  .step-text-selected {
    font-weight: bold;
  } */
  .mobile-progress-bar-container {
    display: none;
    font-weight: bold;
    height: 260px;
    position: relative;
    padding-top: 16px;
  }
  .mobile-step-container {
    display: none;
    font-weight: bold;
  }
  @media only screen and (max-width: 480px) {
    .component-container {
      padding: 0;
    }
    .progress-bar-container,
    .step-container {
      display: none;
    }
    .mobile-progress-bar-container,
    .mobile-step-container {
      display: block;
    }
  }
  
  .hide {
    display: none;
  }
  
  .chevron-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100%;
  }
  
  .v-step-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    height: 60%;
  }
  .v-step {
    position: relative;
    margin-top: 0.25rem;
    cursor: default;
  }
  .v-step:before {
    content: " ";
    position: absolute;
    width: 1em;
    height: 1em;
    border-radius: 100%;
    background: #fff;
    border: 2px solid #606060;
    right: 0;
    left: 0;
    margin: 0 auto;
    bottom: 100%;
  }
  .v-step-selected:before {
    border: 2px solid #036;
  }
  .v-step-passed {
    cursor: pointer;
  }
  .v-step-passed:before {
    border: 2px solid #036;
    background: #036;
  }
  .v-step-text {
    position: absolute;
    -webkit-transform: translateY(-80%);
    transform: translateY(-80%);
    white-space: nowrap;
    color: #494949;
    left: 30px;
    font-weight: normal;
  }
  .v-step-text-selected {
    font-weight: bold;
  }
  .v-progress-bar-container {
    background-color: #606060;
    width: 0.25rem;
    border-radius: 0.25rem;
    position: absolute;
    height: 60%;
    left: 22px;
  }
  .v-progress-bar {
    width: 100%;
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    background-color: #036;
    transition: height 0.6s ease;
  }
  </style>
  