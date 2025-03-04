class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );

      const playlist = await this._playlistsService.getPlaylist(playlistId);

      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(playlist, null, 2)
      );
      console.log("Email sent successfully:", result);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }
}

module.exports = Listener;
