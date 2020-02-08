import { Component } from '@angular/core';
import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Lemonlight';
  navbarOpen = false;

  constructor(private chatService: ChatService) {
    chatService.messages.subscribe(msg => {
      console.log(msg);
    });
  }

  private message = {
    author: "John Lownie",
    message: "This is a test message"
  };

  sendMsg() {
    console.log("New message from client to websocket: ", this.message);
    this.chatService.sendMessage("Hello, world!");
    // this.chatService.messages.next(this.message);
    this.message.message = "";
  }
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

}
