export class Pop {
  id: string = "";
  image: string = "";
  title: string = "";
  series: string[] = [];

  //constructor(obj: Pop) {
    //Object.assign(this, obj);
  //}
  constructor(id: string, series: string[], title: string, image: string) {
    this.id = id
    this.series = series
    this.title = title
    this.image = image
  }
}

