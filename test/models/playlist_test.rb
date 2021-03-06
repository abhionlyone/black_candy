# frozen_string_literal: true

require 'test_helper'

class PlaylistTest < ActiveSupport::TestCase
  test 'should have name' do
    assert_not Playlist.new(name: nil, user: users(:admin)).valid?
  end

  test 'should raise error when song already in playlist' do
    assert_raises do
      playlists(:playlist1).push songs(:mp3_sample)
    end
  end

  test 'should get songs ordered by the date when the song pushed to the playlist' do
    playlist = Playlist.create(name: 'test', user: users(:admin))
    playlist.songs.push songs(:flac_sample)
    playlist.songs.push songs(:opus_sample)
    playlist.songs.push songs(:m4a_sample)

    assert_equal ['flac_sample', 'opus_sample', 'm4a_sample'], playlist.reload.songs.pluck(:name)
  end
end
