<template>
  <div ref="modal">
    <div class="modal fade show" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Information collection notice</h2>
          </div>
          <div class="modal-body">
            <p>
              Your personal information is collected by the Ministry of Health
              under the authority of sections 26(a) and (c) of the
              <em
                >Freedom of Information and Protection of Privacy Act
                (FIPPA).</em
              >
              It is collected for the purpose of administering Medical Services
              Plan and Supplementary Benefits under the
              <em>Medicare Protection Act,</em> and to determine, verify and
              administer your and your family’s Fair PharmaCare coverage under
              the <em>Pharmaceutical Services Act.</em> If you have questions
              about the collection of personal information on this form, contact
              the HIBC Chief Privacy Officer at PO Box 9035 STN Prov Govt,
              Victoria BC V8W 9E3; or call 604 683-7151 (Vancouver) or 1 800
              663-7100 (toll free).
            </p>
            <Captcha
              v-if="!isCaptchaValid"
              :api-base-path="captchaAPIBasePath"
              :nonce="applicationUuid"
              @captcha-loaded="handleCaptchaLoaded()"
              @captcha-verified="handleCaptchaVerified($event)"
            />
            <div v-if="isCaptchaValid" class="text-success">
              Captcha successfully verified.
            </div>
            <div class="mt-3">
              <input
                id="is-terms-accepted"
                v-model="isTermsAccepted"
                type="checkbox"
                data-cy="consentCheckbox"
                class="d-inline"
              />
              <label for="is-terms-accepted" class="mt-3 ml-2 d-inline"
                ><b>I have read and understand this information</b></label
              >
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <ButtonComponent
              label="Continue"
              cypress-id="consentContinue"
              :disabled="!isCaptchaValid || !isTermsAccepted"
              @click="closeModal()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "./Button.vue";
import Captcha from "./Captcha.vue";
import { SET_CAPTCHA_TOKEN } from "@/store";

export default {
  name: "ConsentModal",
  components: {
    ButtonComponent: Button,
    Captcha,
  },
  emits: ["captchaVerified", "close"],
  data: () => {
    return {
      focusableEls: [],
      focusedEl: null,
      captchaAPIBasePath: "/itrf/api/captcha",
      applicationUuid: null,
      isCaptchaValid: false,
      isTermsAccepted: false,
    };
  },
  created() {
    this.applicationUuid = this.$store.state.applicationUuid;
    window.addEventListener("keydown", this.handleKeyDown);
    document.body.classList.add("no-scroll");
  },
  unmounted() {
    window.removeEventListener("keydown", this.handleKeyDown);
    document.body.classList.remove("no-scroll");
  },
  mounted() {
    this.focusableEls = this.getFocusableEls();
  },
  methods: {
    getFocusableEls() {
      // Create an array of focusable elements from the contents of the modal
      return Array.from(
        this.$refs.modal.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button, [tabindex="0"]',
        ),
      );
    },
    handleCaptchaLoaded() {
      this.focusableEls = this.getFocusableEls();
    },
    handleCaptchaVerified(captchaToken) {
      this.$emit("captchaVerified", captchaToken);
      this.$store.commit(SET_CAPTCHA_TOKEN, captchaToken);
      this.isCaptchaValid = true;
      setTimeout(() => {
        this.focusableEls = this.getFocusableEls();
      }, 0);
    },
    closeModal() {
      this.$emit("close", true);
    },
    handleKeyDown(event) {
      // Handle tabbing
      if (event.key === "Tab") {
        // Prevent usual tabbing, manually set focus
        event.preventDefault();
        if (event.shiftKey) {
          this.handleTabBackwards();
        } else {
          this.handleTab();
        }
      }
    },
    // Move to next focusable element, if at last element, move to first
    handleTab() {
      if (!this.focusedEl && this.focusableEls.length > 0) {
        this.focusedEl = this.focusableEls[0];
        this.focusedEl.focus();
        return;
      }
      const position = this.focusableEls.indexOf(this.focusedEl);
      if (position === this.focusableEls.length - 1) {
        this.focusedEl = this.focusableEls[0];
      } else {
        this.focusedEl = this.focusableEls[position + 1];
      }
      this.focusedEl.focus();
    },
    // Move to next focusable element, if at last element, move to first
    handleTabBackwards() {
      if (!this.focusedEl && this.focusableEls.length > 0) {
        this.focusedEl = this.focusableEls[this.focusableEls.length - 1];
        this.focusedEl.focus();
        return;
      }
      const position = this.focusableEls.indexOf(this.focusedEl);
      if (position === 0) {
        this.focusedEl = this.focusableEls[this.focusableEls.length - 1];
      } else {
        this.focusedEl = this.focusableEls[position - 1];
      }
      this.focusedEl.focus();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.4);
  overflow-y: scroll;
}
.modal-header {
  background: #036;
  color: #fff;
}
</style>
