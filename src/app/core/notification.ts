import * as moment from 'moment';

export class Notification {
  type:string = '';
  typeRu:string = '';
  name:string = '';
  date: Date;
  dateString:string = '';
  important = false;
  importanceRu:string = '';
  text:string = '';
  textPreview:string = '';
  checked = false;
  read = false;
  archive = false;

  trimToWord(string: string, count:number){
    if(string.length>count){
      const a=string.substring(0,count);
      return a.substring(0,Math.max(a.lastIndexOf(' '),a.lastIndexOf(',')-1));
    } else {
      return string;
    }
  };

  constructor(json_item?: any) {
    if (!json_item) {
      return;
    }

    switch (json_item.type) {
      case 'Заявка':
        this.type = 'request';
        break;
      case 'Согласование':
        this.type = 'approval';
        break;
      case 'На доработку':
        this.type = 'revision';
        break;
    }

    if (json_item.importance === 'Важно') {
      this.important = true;
    }

    this.importanceRu = json_item.importance;
    this.typeRu = json_item.type;
    this.name = json_item.name;
    this.date = new Date(Date.parse(json_item.date));
    this.dateString = moment(this.date).format('hh:mm DD MMM');
    this.text = json_item.text;
    this.textPreview = this.trimToWord(this.text, 150) + '...';
  }
}
