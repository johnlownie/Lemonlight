import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Lemonlight';
  navbarOpen: boolean = false;
  message: string;
  messages: string[] = [];

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);
      });
  }

  sendMessage() {
    console.log("New message from client to websocket: ", this.message);
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

}
