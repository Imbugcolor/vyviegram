import Swal from "sweetalert2";

export const stylePopUpConfirm = Swal.mixin({
  customClass: {
    confirmButton: "btn-ok",
    cancelButton: "btn-cancel-swal",
    title: "styleTitle",
  },
  buttonsStyling: false,
});

export default stylePopUpConfirm;
