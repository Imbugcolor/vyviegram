import Swal from "sweetalert2";

const Message = (title, text, imageUrl) => Swal.mixin({
  customClass: {
    confirmButton: "btn-ok",
    title: "styleTitle",
  },
  buttonsStyling: false,
  }).fire({
    title,
    text,
    imageUrl,
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: 'Custom image',
  }).then((result) => {
  if (result.isConfirmed) {
    return;
  } 
});

export default Message
