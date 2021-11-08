(function() {
  const sdk = require("microsoft-cognitiveservices-speech-sdk");
  const fs = require("fs")

  const subscription = "36f3e722615340cea6cbcaca327b51e8"
	const region = "eastus"
  const readingMaterial = "textdata"

  // https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started-text-to-speech?tabs=script%2Cwindowsinstall&pivots=programming-language-javascript#customize-audio-format
  // https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started-text-to-speech?tabs=script%2Cwindowsinstall&pivots=programming-language-javascript#use-ssml-to-customize-speech-characteristics
  const filename = "audio.wav"
  
  function synthesizeSpeech() {
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);

    const speechConfig = sdk.SpeechConfig.fromSubscription(subscription, region);
    // Note: if only language is set, the default voice of that language is chosen.
    // https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support#speech-to-text
    speechConfig.speechSynthesisLanguage = "zh-CN";
    // The voice setting will overwrite language setting.
    // The voice setting will not overwrite the voice element in input SSML.
    // https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support#speech-to-text
    // https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/#features
    speechConfig.speechSynthesisVoiceName = "zh-CN-XiaoxiaoNeural";

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    fs.readFile(readingMaterial, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      synthesizer.speakTextAsync(
        data,
        result => {
            synthesizer.close();
            if (result) {
                // return result as stream
                return fs.createReadStream(filename);
            }
        },
        error => {
            console.log(error);
            synthesizer.close();
        });
    })

  }

  synthesizeSpeech();
})()

