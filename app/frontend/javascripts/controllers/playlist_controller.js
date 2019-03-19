import { Controller } from 'stimulus';
import { ajax } from 'rails-ujs';

export default class extends Controller {
  static targets = ['item', 'count'];

  initialize() {
    this.player = App.player;
  }

  connect() {
    this.showPlayingItem();
  }

  play({ target }) {
    const { songId } = target.closest('.playlist__item').dataset;
    const playlistIndex = this.player.playlistIndexOf(songId);

    if (playlistIndex != -1) {
      this.player.skipTo(playlistIndex);
    } else {
      ajax({
        url: '/playlist/current',
        type: 'put',
        data: `update_action=push&song_id=${songId}`,
        success: () => {
          this.player.skipTo(this.player.pushToPlaylist(songId));
        }
      });
    }
  }

  deleteSong(event) {
    event.stopPropagation();

    const playlistItemElement = event.target.closest('.playlist__item');
    const { songId } = playlistItemElement.dataset;

    ajax({
      url: `/playlist/${this.id}`,
      type: 'put',
      dataType: 'script',
      data: `update_action=delete&song_id=${songId}`,
      success: () => {
        if (this.isCurrent) { this.player.deleteFromPlaylist(songId); }

        // When already delete all playlist items, use rails ujs to render empty page,
        // avoid to remove item manually.
        if (this.count > 1) {
          playlistItemElement.remove();
          this.countTarget.innerText = this.count - 1;
        }
      }
    });
  }

  showPlayingItem() {
    this.itemTargets.forEach((element) => {
      element.classList.toggle('playlist__item--active', element.dataset.songId == this.player.currentSong.id);
    });
  }

  get id() {
    return this.data.get('id');
  }

  get isCurrent() {
    return this.id == 'current';
  }

  get count() {
    return Number(this.countTarget.innerText);
  }
}
