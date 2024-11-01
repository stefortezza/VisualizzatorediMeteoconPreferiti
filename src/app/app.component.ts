import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  citta: string = '';
  datiMeteo: any;
  cittaPreferite: any[] = [];

  constructor(private http: HttpClient) {
    this.caricaPreferiti();
  }

  async ottieniCoordinate(citta: string): Promise<{ lat: number, lon: number } | null> {
    if (citta.toLowerCase() === 'roma') {
      return { lat: 41.9028, lon: 12.4964 };
    }
    alert('Coordinate non trovate per la città inserita.');
    return null;
  }

  async cercaMeteo() {
    const coordinate = await this.ottieniCoordinate(this.citta);
    if (!coordinate) {
      return;
    }

    this.http
      .get(`https://api.open-meteo.com/v1/forecast?latitude=${coordinate.lat}&longitude=${coordinate.lon}&current_weather=true`)
      .subscribe((data: any) => {
        this.datiMeteo = data.current_weather;
      });
  }

  aggiungiAiPreferiti() {
    if (this.datiMeteo && !this.cittaPreferite.some(item => item.nome === this.citta)) {
      this.cittaPreferite.push({ nome: this.citta, ...this.datiMeteo });
      localStorage.setItem('cittaPreferite', JSON.stringify(this.cittaPreferite));
    }
  }

  caricaPreferiti() {
    const preferitiSalvati = localStorage.getItem('cittaPreferite');
    if (preferitiSalvati) {
      this.cittaPreferite = JSON.parse(preferitiSalvati);
    }
  }

  rimuoviDaPreferiti(indice: number) {
    this.cittaPreferite.splice(indice, 1);
    localStorage.setItem('cittaPreferite', JSON.stringify(this.cittaPreferite));
  }
}
