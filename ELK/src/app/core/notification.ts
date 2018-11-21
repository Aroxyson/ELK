export class Notification {
  type = '';
  typeRu = '';
  name = '';
  date: Date;
  dateString = '';
  importance = '';
  importanceRu = '';
  text = '';

  constructor(json_item?: any) {
    const options = {
      day: '2-digit',
      month: 'short'
    };

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
      this.importance = 'important';
    }
    this.importanceRu = json_item.importance;
    this.typeRu = json_item.type;
    this.name = json_item.name;
    this.date = new Date(Date.parse(json_item.date));
    this.dateString = this.date.getHours() + ':' + this.date.getMinutes() + ' ' + this.date.toLocaleDateString('ru', options);
    this.text = json_item.text;
  }
}
