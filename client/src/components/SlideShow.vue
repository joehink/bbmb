<template>
  <div class="slideshow">
    <div
      v-for="(image, index) in images"
      v-bind:class="{
        fadein: index === imageIndex,
        fadeout: (index === imageIndex - 1) || (index === images.length - 1 && imageIndex === 0)
      }"
      :style="{ backgroundImage: `url(${image})` }"
      :key="image"
      class="slide">
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlideShow',
  data() {
    // Aray of slide show images
    const images = [
      '/static/images/auth/beachBoys1964.jpg',
      '/static/images/auth/beachBoysRehearsal.jpg',
      '/static/images/auth/edSullivanShow.jpg',
      '/static/images/auth/mikeBrianWriting.jpg',
      '/static/images/auth/petSoundsSinging.jpg',
    ];
    return {
      images,
      // start image index at random number
      imageIndex: Math.floor(Math.random() * images.length),
    };
  },
  created() {
    // Start slideshow when component is created
    this.startRotation();
  },
  beforeDestroy() {
    // Remove javascript timer when component is destroyed
    clearInterval(this.timer);
  },
  methods: {
    startRotation() {
      // Initialize a javascript timer that changes slides every 8 seconds
      this.timer = setInterval(this.next, 8000);
    },
    next() {
      // If slide show reaches last slide
      if (this.imageIndex >= this.images.length - 1) {
        // Go back to first slide
        this.imageIndex = 0;
      } else {
        // Go to next slide
        this.imageIndex += 1;
      }
    },
  },
};
</script>

<style scoped>
  .slideshow {
    position: relative;
    display: none;
  }
  .slide {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-size: cover;
    background-position: center;
    opacity: 0;
  }
  .fadein {
    -webkit-animation: fadein 8s;
    animation: fadein 8s;
  }
  .fadeout {
    -webkit-animation: fadeout 8s;
    animation: fadeout 8s;
  }

  @-webkit-keyframes fadein {
    0% { opacity: 0 }
    50% { opacity: 1 }
    100% { opacity: 1 }
  }

  @-webkit-keyframes fadeout {
    0% { opacity: 1 }
    50% { opacity: 0 }
    100% { opacity: 0 }
  }

  @keyframes fadein {
    0% { opacity: 0 }
    50% { opacity: 1 }
    100% { opacity: 1 }
  }
  @keyframes fadeout {
    0% { opacity: 1 }
    50% { opacity: 0 }
    100% { opacity: 0 }
  }


  @media(min-width: 768px) {
    .slideshow {
      display: block;
    }
  }
</style>

