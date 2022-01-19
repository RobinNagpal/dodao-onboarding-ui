<script setup>
import { toRefs } from '@vueuse/core';

const props = defineProps({
  active: {
    type: Boolean,
    require: true
  }
});

const { active } = toRefs(props);
</script>
<template>
  <div class="main" :class="{ active: active === true }">
    <small><i class="fa fa-smile-o"></i></small>
    <div class="text">
      <h2>Your Personal Information</h2>
      <p>Enter your personal information to get closer to copanies.</p>
    </div>
    <div class="input-text">
      <div class="input-div">
        <input
          type="text"
          required=""
          require=""
          id="user_name"
          class="warning"
        />
        <span>First Name</span>
      </div>
      <div class="input-div">
        <input type="text" required="" /> <span>Last Name</span>
      </div>
    </div>
    <div class="input-text">
      <div class="input-div">
        <input type="text" required="" require="" class="warning" />
        <span>Phone number</span>
      </div>
      <div class="input-div">
        <input type="text" required="" require="" class="warning" />
        <span>E-mail Address</span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.main {
  padding: 40px;
  small {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2px;
    height: 30px;
    width: 30px;
    background-color: #ccc;
    color: yellow;
    font-size: 19px;
  }
}

input[type='text'] {
  width: 100%;
  height: 40px;
  border: none;
  outline: 0;
  border-radius: 5px;
  border: 1px solid #cbced4;
  gap: 20px;
  box-sizing: border-box;
  padding: 0px 10px;
}
select {
  width: 100%;
  height: 40px;
  border: none;
  outline: 0;
  border-radius: 5px;
  border: 1px solid #cbced4;
  gap: 20px;
  box-sizing: border-box;
  padding: 0px 10px;
}
.input-div {
  input {
    &:focus {
      ~ {
        span {
          top: -15px;
          left: 6px;
          font-size: 10px;
          font-weight: 600;
        }
      }
    }
    &:valid {
      ~ {
        span {
          top: -15px;
          left: 6px;
          font-size: 10px;
          font-weight: 600;
        }
      }
    }
  }
  span {
    top: -15px;
    left: 6px;
    font-size: 10px;
  }
}
.buttons {
  button {
    height: 40px;
    width: 100px;
    border: none;
    border-radius: 5px;
    background-color: #0075ff;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
  }
}
.button_space {
  display: flex;
  gap: 20px;
  button {
    &:nth-child(1) {
      background-color: #fff;
      color: #000;
      border: 1px solid#000;
    }
  }
}
</style>
