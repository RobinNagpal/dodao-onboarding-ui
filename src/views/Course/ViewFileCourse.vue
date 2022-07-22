<script setup lang="ts">
import { courses } from '@/utils/courses/dummy_courses';
import CourseNavigation from './CourseNavigation.vue';
const course = courses[0];
</script>

<template>
  <div class="mt-4 container-default">
    <Block slim :title="course.title">
      <div class="flex flex-col md:flex-row">
        <div class="nav-wrapper my-4">
          <CourseNavigation :course="course"></CourseNavigation>
        </div>
        <div class="flex-1 ml-4 my-4">
          <router-view v-if="course" :course="course" />
        </div>
      </div>
    </Block>
  </div>
</template>
<style lang="scss" scoped>
.nav-wrapper {
  width: 100%;
  @screen md {
    max-width: 300px;
  }
}
</style>
