describe "Player using CoffeScript", ->
    song = player = ""

    beforeEach ->
        player = new Player
        song = new Song

    it "should be able to play a Song", ->
        player.play(song)
        expect(player.currentlyPlayingSong).toEqual(song)
        expect(player).toBePlaying(song)


    describe "when song has been paused", ->
        beforeEach ->
            player.play(song)
            player.pause()


        it "should indicate that the song is currently paused", ->
            expect(player.isPlaying).toBeFalsy()
            expect(player).not.toBePlaying(song)

        it "should be possible to resume", ->
            player.resume()
            expect(player.isPlaying).toBeTruthy()
            expect(player.currentlyPlayingSong).toEqual(song)


    it "tells the current song if the user has made it a favorite", ->
        spyOn(song, 'persistFavoriteStatus')

        player.play(song)
        player.makeFavorite()

        expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true)


    describe "#resume", ->
        it "should throw an exception if song is already playing", ->
            player.play(song)

            expect(->
                player.resume()
            ).toThrow("song is already playing")
