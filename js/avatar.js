'use strict';
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const avatarChooser = window.main.adForm.querySelector('.ad-form__field input[type=file]');
const roomChooser = window.main.adForm.querySelector('.ad-form__upload input[type=file]');

function createRoomPreview(reader) {
  const roomPreview = document.createElement("img");
  if (window.main.roomPreviewContainer.children[0]) {
    window.main.roomPreviewContainer.children[0].remove();
  }
  window.main.roomPreviewContainer.appendChild(roomPreview);
  window.main.roomPreviewContainer.style.display = "flex";
  window.main.roomPreviewContainer.style.alignItems = "center";
  window.main.roomPreviewContainer.style.justifyContent = "center";
  roomPreview.style.maxHeight = "100%";
  roomPreview.style.maxWidth = "100%";
  roomPreview.alt = "Фото жилья";
  roomPreview.src = reader.result;
}

function createAvatar(reader) {
  window.main.avatarPreview.src = reader.result;
}

function onChangeFile(fileChooser, createFunction) {
  const file = fileChooser.files[0];
  const fileName = file.name.toLowerCase();

  const match = FILE_TYPES.some(function (it) {
    return fileName.endsWith(it);
  });

  if (match) {
    const reader = new FileReader();

    reader.addEventListener('load', function () {
      createFunction(reader);
    });

    reader.readAsDataURL(file);
  }
}

avatarChooser.addEventListener('change', function () {
  onChangeFile(avatarChooser, createAvatar);
});

roomChooser.addEventListener('change', function () {
  onChangeFile(roomChooser, createRoomPreview);
});
