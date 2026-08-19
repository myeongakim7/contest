$(function () {

  // nav
  $(".hamburger").click(function () {
    $(".nav_wrap").toggleClass("on");
    $("body").toggleClass("on");
    $(this).toggleClass("on");

  });

let isHidden = false;

$(window).on("scroll", function () {
  let currentScroll = $(this).scrollTop();
  let wrapTop = $(".wrap").offset().top;

  // wrap 진입 시 hide
  if (!isHidden && currentScroll >= wrapTop) {
    $(".header.sub .hamburger, .header.sub .logo").addClass("hide");
    isHidden = true;
  }

  // wrap 위로 올라가면 다시 보이기
  if (isHidden && currentScroll < wrapTop - 100) {
    $(".header.sub .hamburger, .header.sub .logo").removeClass("hide");
    isHidden = false;
  }
});

  $("#input_photo").change(function () {
    var filename = this.files[0]?.name;
    if (filename) {
      $("#m_entry_form .input_box .photo").first().text(filename);
    } else {
      $("#m_entry_form .input_box .photo").first().text(
        "drag & drop / 이미지 파일 크기 제한 : 10MB(JPG, PNG)",
      );
    }
  });

  function syncMFormConsentRadioLabels() {
    $("#m_entry_form .radio_wrap").each(function () {
      var $wrap = $(this);
      $wrap.find(".radio_box label").removeClass("on");
      var $checked = $wrap.find("input[type='radio']:checked");
      if ($checked.length) {
        $checked.siblings("label").addClass("on");
      }
    });
  }

  $("#m_entry_form .radio_wrap .radio_box input[type='radio']").change(function () {
    var $wrap = $(this).closest(".radio_wrap");
    $wrap.find(".radio_box label").removeClass("on");
    $(this).siblings("label").addClass("on");
  });

  syncMFormConsentRadioLabels();

  $("#input_phone").on("input", function () {
    const digits = String($(this).val()).replace(/\D/g, "").slice(0, 11);
    $(this).val(digits);
  });

  $("#input_phone").on("paste", function (e) {
    e.preventDefault();
    const text = (e.originalEvent.clipboardData || window.clipboardData).getData("text");
    const digits = String(text).replace(/\D/g, "").slice(0, 11);
    $(this).val(digits);
  });

  function sanitizeSixCharAlphaNum(raw) {
    var s = String(raw || "");
    var out = "";
    for (var i = 0; i < s.length && out.length < 6; i++) {
      var ch = s.charAt(i);
      if (/^[A-Za-z0-9]$/.test(ch)) {
        out += ch;
      }
    }
    return out;
  }

  function isSixCharAlphaNum(s) {
    return typeof s === "string" && /^[A-Za-z0-9]{6}$/.test(s);
  }

  function focusContestEntryField($form, fieldName) {
    switch (fieldName) {
      case "category_idx":
        $form.find(".select_box .select_btn").focus();
        break;
      case "title":
        $form.find("#input_title").focus();
        break;
      case "content":
        $form.find("#input_text").focus();
        break;
      case "name":
        $form.find("#input_name").focus();
        break;
      case "phone":
        $form.find("#input_phone").focus();
        break;
      case "password":
        $form.find("#input_pswd").focus();
        break;
      case "consent":
        $form.find("input[name='consent'][value='Y']").focus();
        break;
      case "award_use_consent":
        $form.find("input[name='award_use_consent'][value='Y']").focus();
        break;
      case "photo":
        $form.find("#input_photo").focus();
        break;
      default:
        break;
    }
  }

  function showContestValidationAlert(fieldName) {
    if (fieldName === "consent") {
      $(".alert2").bPopup();
    } else if (fieldName === "award_use_consent") {
      $(".alert2_award").bPopup();
    } else if (fieldName === "photo") {
      $(".alert4").bPopup();
    } else if (fieldName === "password") {
      $(".alert6").bPopup();
    } else {
      $(".alert1").bPopup();
    }
  }

  $("#input_pswd").on("input", function () {
    $(this).val(sanitizeSixCharAlphaNum($(this).val()));
  });

  $("#input_pswd").on("paste", function (e) {
    e.preventDefault();
    const text = (e.originalEvent.clipboardData || window.clipboardData).getData("text");
    $(this).val(sanitizeSixCharAlphaNum(text));
  });

  $(".select_box .select_btn").click(function () {
    $(".select_ul").toggleClass("on");
  });

  $(".select_ul li button").click(function () {
    let itemVal = $(this).val();
    let itemText = $(this).text();

    $(".select_box .select_btn").text(itemText);
    $("#input_category_idx").val(itemVal);
    $(".select_ul").removeClass("on");
  });

  function validateContestEntryRequiredFields($form) {
    var categoryIdx = Number($form.find("#input_category_idx").val() || 0);
    var title = String($form.find("#input_title").val() || "").trim();
    var content = String($form.find("#input_text").val() || "").trim();
    var name = String($form.find("#input_name").val() || "").trim();
    var phone = String($form.find("#input_phone").val() || "").trim();
    var password = String($form.find("#input_pswd").val() || "").trim();
    var consent = String($form.find("input[name='consent']:checked").val() || "");
    var awardUseConsent = String(
      $form.find("input[name='award_use_consent']:checked").val() || "",
    );

    if (!categoryIdx) {
      $(".alert1_5").bPopup();
      $(".select_box .select_btn").focus();
      return false;
    }
    if (!title) {
      $(".alert1_1").bPopup();
      $form.find("#input_title").focus();
      return false;
    }
    if (!content) {
      $(".alert1_2").bPopup();
      $form.find("#input_text").focus();
      return false;
    }
    if (!name) {
      $(".alert1_3").bPopup();
      $form.find("#input_name").focus();
      return false;
    }
    if (!phone) {
      $(".alert1_4").bPopup();
      $form.find("#input_phone").focus();
      return false;
    }
    if (!password) {
      $(".alert6").bPopup();
      $form.find("#input_pswd").focus();
      return false;
    }
    if (!isSixCharAlphaNum(password)) {
      $(".alert6").bPopup();
      $form.find("#input_pswd").focus();
      return false;
    }
    if (consent !== "Y" && awardUseConsent !== "Y") {
      $(".alert2_both").bPopup();
      $form.find("input[name='consent']").first().focus();
      return false;
    }
    if (consent !== "Y") {
      $(".alert2").bPopup();
      $form.find("input[name='consent']").first().focus();
      return false;
    }
    if (awardUseConsent !== "Y") {
      $(".alert2_award").bPopup();
      $form.find("input[name='award_use_consent']").first().focus();
      return false;
    }

    return true;
  }

  $("#m_entry_form").on("submit", function (e) {
    e.preventDefault();

    const $form = $(this);
    $form.find("#input_title").val(String($form.find("#input_title").val() || "").trim());
    $form.find("#input_text").val(String($form.find("#input_text").val() || "").trim());
    $form.find("#input_name").val(String($form.find("#input_name").val() || "").trim());
    $form.find("#input_phone").val(String($form.find("#input_phone").val() || "").replace(/\D/g, "").slice(0, 11));
    $form.find("#input_pswd").val(sanitizeSixCharAlphaNum($form.find("#input_pswd").val()));

    if (!validateContestEntryRequiredFields($form)) {
      return;
    }
    const formData = new FormData(this);
    const $submitBtn = $form.find(".btn_submit");

    $submitBtn.prop("disabled", true);

    $.ajax({
      url: $form.attr("action"),
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      success: function () {
        $(".alert3").bPopup();
      },
      error: function (xhr) {
        const $form = $("#m_entry_form");
        const response = xhr.responseJSON || {};
        const code = response.code || "";
        const errors = response.errors || {};

        if (code === "ENTRY_NOT_OPEN") {
          alert(response.message || "접수는 2026년 4월 6일부터 시작됩니다.");
          return;
        }

        if (code === "DUPLICATE") {
          $(".alert5").bPopup();
          return;
        }

        if (code === "INVALID_PASSWORD") {
          $(".alert_delete_error_msg").html(
            response.message ||
              "입력값을 확인해주세요.",
          );
          $(".alert_delete_error").bPopup();
          return;
        }

        if (code === "VALIDATION_ERROR") {
          var order = [
            "category_idx",
            "title",
            "content",
            "name",
            "phone",
            "password",
            "consent",
            "award_use_consent",
            "photo",
          ];
          var first =
            response.firstField ||
            (function () {
              for (var i = 0; i < order.length; i++) {
                if (errors[order[i]]) {
                  return order[i];
                }
              }
              return null;
            })();
          if (first === "password" && errors.password) {
            const pwErr = errors.password;
            const msg =
              typeof pwErr === "string"
                ? pwErr
                : Array.isArray(pwErr) && pwErr[0]
                  ? pwErr[0]
                  : "입력값을 확인해주세요.";
            $(".alert_delete_error_msg").text(msg);
            $(".alert_delete_error").bPopup();
            focusContestEntryField($form, "password");
            return;
          }
          if (first) {
            focusContestEntryField($form, first);
            if (errors.consent && errors.award_use_consent) {
              $(".alert2_both").bPopup();
            } else {
              showContestValidationAlert(first);
            }
          } else {
            $(".alert1").bPopup();
          }
          return;
        }

        if (code === "PHOTO_ERROR" || errors.photo) {
          $(".alert4").bPopup();
          focusContestEntryField($form, "photo");
          return;
        }

        if (errors.consent && errors.award_use_consent) {
          $(".alert2_both").bPopup();
          focusContestEntryField($form, "consent");
          return;
        }

        if (errors.consent) {
          $(".alert2").bPopup();
          focusContestEntryField($form, "consent");
          return;
        }

        if (errors.award_use_consent) {
          $(".alert2_award").bPopup();
          focusContestEntryField($form, "award_use_consent");
          return;
        }

        if (errors.password) {
          const pwErr = errors.password;
          const msg =
            typeof pwErr === "string"
              ? pwErr
              : Array.isArray(pwErr) && pwErr[0]
                ? pwErr[0]
                : "입력값을 확인해주세요.";
          $(".alert_delete_error_msg").text(msg);
          $(".alert_delete_error").bPopup();
          focusContestEntryField($form, "password");
          return;
        }

        var order2 = [
          "category_idx",
          "title",
          "content",
          "name",
          "phone",
        ];
        for (var j = 0; j < order2.length; j++) {
          if (errors[order2[j]]) {
            focusContestEntryField($form, order2[j]);
            $(".alert1").bPopup();
            return;
          }
        }

        $(".alert1").bPopup();
      },
      complete: function () {
        $submitBtn.prop("disabled", false);
      },
    });
  });

  $(document).on("click", ".alert3 .btn_confirm", function () {
    window.location.href = "/";
  });
});
