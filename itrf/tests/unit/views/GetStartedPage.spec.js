import Page from "@/views/GetStartedPage.vue";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import router from "@/router/index";
import { cloneDeep } from "lodash";
import formTemplate from "@/store";
import dummyData from "@/store/states/form-dummy-data";
import { it, describe, expect, beforeEach, afterEach, vi } from "vitest";
import axios from "axios";
import logService from "@/services/log-service";

vi.mock("axios");

vi
  .spyOn(logService, "logNavigation")
  .mockImplementation(() => Promise.resolve("logged"));
vi
  .spyOn(logService, "logError")
  .mockImplementation(() => {
    Promise.resolve("logged");
  });
vi
  .spyOn(logService, "logInfo")
  .mockImplementation(() => Promise.resolve("logged"));

const mockAxiosResponse = {
  data: {
    SPA_ENV_ITRF_MAINTENANCE_FLAG: "false",
    SPA_ENV_ITRF_MAINTENANCE_START: "2024-02-28 11:00:00 AM",
    SPA_ENV_ITRF_MAINTENANCE_END: "2024-02-28 01:00:00 PM",
    SPA_ENV_ITRF_MAINTENANCE_MESSAGE:
      "This application is currently undergoing maintenance. Please try again later.",
    SPA_ENV_ITRF_TIME_FORMAT: "YYYY-MM-DD h:mm:ss A",
  },
};

axios.get.mockResolvedValue(mockAxiosResponse);
axios.post.mockResolvedValue(mockAxiosResponse);

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
