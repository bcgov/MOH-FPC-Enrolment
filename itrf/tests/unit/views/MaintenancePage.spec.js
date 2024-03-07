import Page from "@/views/MaintenancePage.vue";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import router from "@/router/index";
import { cloneDeep } from "lodash";
import formTemplate from "@/store";
import dummyData from "@/store/states/form-dummy-data";
import { it, describe, expect, beforeEach, afterEach, vi } from "vitest";

describe("GetStartedPage.vue", () => {
  let wrapper = null;
  let store = null;

  beforeEach(async () => {
    let tempForm = cloneDeep(formTemplate);
    tempForm.replaceState(dummyData);
    store = createStore(tempForm);

    wrapper = shallowMount(Page, {
      global: {
        plugins: [store, router],
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders", () => {
    expect(wrapper.element).toBeDefined();
  });
});
