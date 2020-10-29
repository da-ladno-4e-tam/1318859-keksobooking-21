'use strict';
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const avatarChooser = window.main.adForm.querySelector('.ad-form__field input[type=file]');
const avatarPreview = window.main.adForm.querySelector('.ad-form-header__preview img');
const roomChooser = window.main.adForm.querySelector('.ad-form__upload input[type=file]');
const roomPreviewContainer = window.main.adForm.querySelector('.ad-form__photo');

function createRoomPreview(reader) {
  const roomPreview = document.createElement("img");
  if (roomPreviewContainer.children[0]) {
    roomPreviewContainer.children[0].remove();
  }
  roomPreviewContainer.appendChild(roomPreview);
  roomPreviewContainer.style.display = "flex";
  roomPreviewContainer.style.alignItems = "center";
  roomPreviewContainer.style.justifyContent = "center";
  roomPreview.style.maxHeight = "100%";
  roomPreview.style.maxWidth = "100%";
  roomPreview.alt = "Фото жилья";
  roomPreview.src = reader.result;
}

function createAvatar(reader) {
  avatarPreview.src = reader.result;
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
