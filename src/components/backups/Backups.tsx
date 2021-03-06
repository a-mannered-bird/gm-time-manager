
import * as React from 'react';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import { projectTitleCodename } from '../../general-settings.json';

import { getDb, putDb, getValue, putValue } from '../../api/localdb';

export interface BackupsProps {
  projectId?: number;
}

export interface BackupsState {
  importedDb?: any;
  lastBackupDate?: Date;
}

export class Backups extends React.Component<
  BackupsProps,
  BackupsState
> {

  public static defaultProps: Partial<BackupsProps> = {};
  private backupImport: any;

  constructor(props: BackupsProps) {
    super(props);

    this.state = {};
    this.backupImport = React.createRef();    
  }

  // --------------------------------- RENDER -------------------------------

  public render() {
    return (
      <div>
        {this.displayLastDownloadTime()}

        {/* Download */}
        <Button
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<GetAppIcon />}
          onClick={() => this.downloadBackup()}
        >
          Download backup
        </Button>
        &nbsp;&nbsp;
        <Button
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<PublishIcon />}
          onClick={() => this.backupImport.click()}
        >
          Upload backup
        </Button>

        <br/>

        {/* File import for documents */}
        <input id="backup-import"
          className="hide"
          ref={backupImport => this.backupImport = backupImport}
          name="backup-import"
          accept=".json"
          onChange={(e) => this.handleBackupImport((e.target.files || [])[0])}
          type="file"/>

        {this.displayBackupConsole()}

      </div>
    );
  }

  public displayLastDownloadTime () {
    if (!this.state.lastBackupDate) {
      return null;
    }

    const now = new Date().valueOf(  );
    const difference = now - this.state.lastBackupDate.valueOf();
    const hour = (1000 * 60 * 60);
    const day = 24 * hour;
    const dayCount = Math.floor(difference / day);
    const hourCount = Math.floor((difference - dayCount * day) / hour);

    return (
      <p>
        You haven't downloaded any backup since {dayCount} day(s) and {hourCount} hour(s).
      </p>
    );
  }

  public displayBackupConsole () {
    const db = this.state.importedDb;
    if (!db) {
      return null;
    }

    return (
      <p>
        You have imported {db.categories.count} categorie(s).<br/>
        You have imported {db.documents.count} document(s).<br />
        You have imported {db.extracts.count} extract(s).<br />
        You have imported {db.tags.count} tag(s).<br />
        You have imported {db.tagCategories.count} tagCategorie(s).<br />
      </p>
    );
  }

  // --------------------------------- COMPONENT LIFECYCLE -------------------------------

  public componentDidMount() {
    this.loadDatas();
  }

  public loadDatas() {
    getValue('backups.lastBackupDate', (lastBackupDateTimestamp: any) => {
      this.setState({lastBackupDate: new Date(lastBackupDateTimestamp)});
    });
  }

  // --------------------------------- CUSTOM FUNCTIONS -------------------------------

  public downloadBackup() {
    getDb((db) => {
      console.log(db);
      const now = new Date();
      let backupTitle = `${projectTitleCodename}-backup-${now.getFullYear()}-${now.getMonth()}-`;
      backupTitle += `${now.getDay()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
      this.downloadObjectAsJson(db, backupTitle);
      // TODO: Store in DB time of when downloaded a backup 
    });
  }

  /**
   * Will create invisible link element that can download a JSON file, and immediately
   * trigger it before removing it
   *
   * @param json  object  the JSON file content
   * @param filename  string  the name of the downloaded file
   */
  public downloadObjectAsJson(json: any, filename: string){
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }  

  /**
   * Handle file importation with the backup import input
   *
   * @param file  File
   */
  public handleBackupImport (file: File) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (e: any) => {
      if (!e.target) {
        return;
      }

      const datas = JSON.parse(e.target.result);
      putDb(datas, () => {

        // Once datas are injected, we change the lastBackupDate to now
        const now = new Date();
        putValue('backups.lastBackupDate', now.valueOf(), () => {
          this.setState({
            importedDb: datas,
            lastBackupDate: now,
          });
        });
      });
    }
    reader.onerror = (e) => {
      console.error("Couldn't read file.");
    }
  }
}
