/**
 * Created by Ricardo on 15/08/2016.
 */

function updateUserRole(id, coach_cb) {
  $.post('/users/set_coach', {"id": id, "coach": coach_cb.checked}, function (response) {
    if (response != true) {
      coach_cb.checked = !coach_cb.checked;
    }
  }).fail(function () {
    coach_cb.checked = !coach_cb.checked;
  });
}

function updateUserStatus(id, active_cb) {
  $.post('/users/set_status', {"id": id, "active": active_cb.checked}, function (response) {
    if (response != true) {
      active_cb.checked = !active_cb.checked;
    }
  }).fail(function () {
    active_cb.checked = !active_cb.checked;
  });
}