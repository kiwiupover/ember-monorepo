import RouteTemplate from 'ember-route-template';

// This adapter converts the `<template>` into a route template
export default RouteTemplate(
  <template>
    <h2 id="title">Welcome to tui</h2>
    Dave's test app for the TUI
    {{outlet}}
  </template>
);


