import React, { Component } from 'react'
import id3 from 'id3js'

import { 
  capitalizeFirstLetter, 
  removeComma, 
  clean 
} from '../utils/StringUtils'

import Page from '../components/Page'
import Dropzone from '../components/Dropzone'
import Creatable from '../components/Creatable'

class SongsToCSVScreen extends Component {
  state = {
    options: [],
    tags: [],
    showOnlyCsv: false,
    tagsSuffix: ''
  }

  onChangeTags = tags => {
    let tagsSuffix = tags.length > 0 ? ',' : ''
    tags.forEach(tag => {
      tagsSuffix += ' ' + tag.value
    })
    this.setState({ tags, tagsSuffix }, () => {
      this.buildCSV(this.state.files)
    })
  }

  onClickCSV = () => {
    this.setState(prevState => ({ showOnlyCsv: !prevState.showOnlyCsv }))
    // copyToClipboard(this.state.csv) // .replace(/\n/g, "\r\n")
    // can't keep breakline mfker
  }

  onDrop = (files) => {
    this.setState({ files }, () => {
      this.buildCSV(files)
    })

    // console.log('all the files: ', files)
  }

  buildCSV = files => {
    let csv
    const filesWithError = []
    // const tags = this.state.tags.map(x => x.value)
    if (files && files.length > 0) {
      csv = 'Song'
      if (this.state.tags.length > 0)
        csv += ',Tags'
      csv += '\r\n'
      files.forEach(file => {
        const { name } = file
        let author, song

        const nameClean = name && name.replace('.mp3', '').replace('.mp4', '').replace('.m4a', '')
        const parts = (nameClean && nameClean.split(" - ")) || []
        if (parts.length === 2) {
          if (!author) author = parts[0]
          if (!song) song = parts[1]
        }

        if (author && song)
          csv += this.getCSVLine(author, song) // breakline
        else
          filesWithError.push(file)
      })
    }

    this.setState({ filesWithError, csv }, () => {
      filesWithError.forEach(file => {
        id3(file, (err, tags) => {
          // tags now contains your ID3 tags
          // console.log('ID3 file', file.name)
          // console.log('ID3 err', err)
          // console.log('ID3 tags', tags)
          const author = tags.artist
          const song = tags.title
          if (author && song) {
            const { filesWithError, csv } = this.state
            const indexToRemove = filesWithError.indexOf(file)
            if (indexToRemove > -1)
              filesWithError.splice(indexToRemove, 1)
            const newCsv = csv + this.getCSVLine(author, song)
            this.setState({ csv: newCsv, filesWithError })
          }
          // console.log('ID3 tags', tags)
        });
      })
    })
  }
  getCSVLine = (author, song) => {
    if (author && song)
      return `${clean(author.trim())} - ${clean(song.trim())}${this.state.tagsSuffix}\r\n`
    return ''
  }
  render() {
    const { filesWithError, csv, tags, options, showOnlyCsv } = this.state
    if (showOnlyCsv)
      return (
        <Page>
          <code className="clickable" onClick={this.onClickCSV}>
            {csv}
          </code>
        </Page>
      )
    return (
      <Page>
        <Creatable
          value={tags}
          options={options}
          onChange={this.onChangeTags}
          title={`Select the tags for all the songs from this .csv export`}
          placeholder={`Select the tags for all the songs from this .csv export`}
        />
        <Dropzone
          onDrop={this.onDrop}
          title={`Drop your songs here bro.`}
          description={`I haven't checked, but it should be any kind of audio files I guess.`}
        >
        </Dropzone>
        {csv && (
          <div>
            <small>
              After adding all the tags you need, click on the text, then CMD+A => CMD+C to get all in the clipboard<br />After this put it in a text file, save it as 'myfile.csv' and import the csv in a google sheets or excel. <br />Done.
            </small>
            <code
              className="clickable"
              onClick={this.onClickCSV}>
              {csv}
            </code>
          </div>
        )

        }
        {filesWithError && (
          <div>
            <h2>Files that could not be parsed:</h2>
            <ul>
              {
                filesWithError.map(({ name }, i) => <li key={i}>{name}</li>)
              }
            </ul>
          </div>
        )}
      </Page>
    )
  }
}

export default SongsToCSVScreen