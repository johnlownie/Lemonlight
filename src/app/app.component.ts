import { Component } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @BlockUI() blockUI: NgBlockUI;
  title: string = 'Lemonlight';
  navbarOpen: boolean = false;
  message: string;
  messages: string[] = [];

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.blockUI.start();
    setTimeout(() => {
      this.blockUI.stop();
    }, 2500);

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
