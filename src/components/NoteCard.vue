<template>
  <q-card
    flat
    bordered
    class="q-mb-sm cursor-pointer"
    @click="$emit('click', $event)"
  >
    <q-card-section class="q-pt-xs bg-grey-5">
      <div class="text-h5 q-mt-sm q-mb-xs">{{ title }}</div>
      <div class="text-caption">
        {{ description }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
  },
};
</script>
