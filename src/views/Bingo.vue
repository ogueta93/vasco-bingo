<template>
	<b-container fluid>
		<b-row class="menu">
			<b-col>
				<b-navbar toggleable="md" type="light" variant="light">
					<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
					<b-navbar-brand href="#"><i class="fas fa-award"></i></b-navbar-brand>

					<b-collapse is-nav id="nav_collapse">
						<b-navbar-nav class="game-start">
							<b-nav-item v-on:click="showGameConfigurator" href="#">Configurar Partida</b-nav-item>
							<b-nav-item v-on:click="showUserConfigurator" href="#">Administrar Jugadores</b-nav-item>
							<b-nav-item href="#">Estadisticas</b-nav-item>
						</b-navbar-nav>
					</b-collapse>
				</b-navbar>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<!-- resume data -->
				<b-row v-if="(data.gameConfigured && data.usersReady)">
					<b-col>
						<b-card no-body>
							<b-tabs card>
								<b-tab title="Resumen" active>
									<b-row>
										<b-col class="text-center text-success">
											<i class="fas fa-trophy resume-trophy"></i>
										</b-col>
									</b-row>
									<b-row class="resumePriceElement" v-if="resume.moneyCollected > 0">
										<b-col cols="6" class="text-center">
											<b-badge variant="primary">Recolectado</b-badge>
										</b-col>
										<b-col cols="6" class="text-center">
											<div>{{resume.moneyCollected}} €</div>
										</b-col>
									</b-row>
									<b-row class="resumePriceElement" v-if="resume.bingoPrize > 0">
										<b-col cols="6" class="text-center">
											<b-badge variant="success">Premio Bingo</b-badge>
										</b-col>
										<b-col cols="6" class="text-center">
											<div>{{resume.bingoPrize}} €</div>
										</b-col>
									</b-row>
									<b-row class="resumePriceElement" v-if="resume.linePrize > 0">
										<b-col cols="6" class="text-center">
											<b-badge variant="info">Premio Línea</b-badge>
										</b-col>
										<b-col cols="6" class="text-center">
											<div>{{resume.linePrize}} €</div>
										</b-col>
									</b-row>
									<b-row class="resumePriceElement" v-if="resume.bankingRetention > 0">
										<b-col cols="6" class="text-center">
											<b-badge variant="secondary">Retención Banca</b-badge>
										</b-col>
										<b-col cols="6" class="text-center">
											<div>{{resume.bankingRetention}} €</div>
										</b-col>
									</b-row>
									<b-row class="resumePriceElement" v-if="(data.lastLineWinner || data.lastBingoWinner)">
										<table class="table table-striped table-dark table-sm table-last-winners">
											<thead>
												<tr>
													<th v-if="data.lastBingoWinner" scope="col">Último Ganador Bingo</th>
													<th v-if="data.lastLineWinner" scope="col">Último Ganador Línea</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td v-if="data.lastBingoWinner">{{data.lastBingoWinner}}</td>
													<td v-if="data.lastLineWinner">{{data.lastLineWinner}}</td>
												</tr>
											</tbody>
										</table>
									</b-row>
								</b-tab>
								<b-tab title="Apuestas">
									<b-row class="betElement" v-for="user in data.users" v-bind:key="user.id">
										<b-col cols="5">
											<b-badge variant="light" class="variant-bet">{{user.name}}</b-badge>
										</b-col>
										<b-col cols="2" class="bet-price" :data-id="user.id">
											{{Number(parseFloat(user.lastCardboardBetNumber * data.cardboardPrice)).toFixed(2)}}
										</b-col>
										<b-col cols="5">
											<b-input-group>
												<b-form-input  type="number" class="bet-input" :data-id="user.id" v-model="user.lastCardboardBetNumber"/>
												<b-input-group-prepend is-text>
													<input type="checkbox" class="inputBet" :data-id="user.id" @change="updateBet($event)">
												</b-input-group-prepend>
											</b-input-group>
										</b-col>
									</b-row>
								</b-tab>
							</b-tabs>
						</b-card>
					</b-col>
				</b-row>
			</b-col>
			<b-col cols="6">
				<!-- boardgame -->
				<b-row class="board-element">
					<b-col class="text-center game-start">
						<button type="button" class="btn btn-lg btn-primary" v-on:click="startGame">¡Empezar Bingo!</button>
					</b-col>
					<b-col class="text-center game-element game-hide"  id="pauseButtomRow">
						<button type="button" id="pauseButtom" class="btn btn-lg btn-primary" v-on:click="pauseGame">Pausar</button>
					</b-col>
					<b-col class="text-center game-end game-hide">
						<button type="button" id="newGameButtom" class="btn btn-lg btn-primary" v-on:click="newGame">Nueva Partida</button>
					</b-col>
				</b-row>
				<br/>
				<b-row v-for="n in rows">
					<b-col v-for="m in cols" class="board-col">
						<div v-bind:data-boarNumber="((n - 1) * cols) + m" class="board-number rounded-circle border border-dark">
							{{((n - 1) * cols) + m}}
						</div>
					</b-col>
				</b-row>
				<b-row class="board-element">
					<b-col class="text-center game-element game-hide">
						<div>
							<b-button-group>
								<button type="button" id="callLine" class="btn btn-lg btn-info" v-on:click="callLine">Línea</button>
								<button type="button" id="callBingo" class="btn btn-lg btn-success" v-on:click="callBingo">Bingo</button>
							</b-button-group>
						</div>
					</b-col>
				</b-row>
			</b-col>
			<b-col>
				<!-- last number price -->
				<div id="lastPrizeNumber" class="mx-auto game-hide"></div>
			</b-col>
		</b-row>
		<!-- modals -->
		<b-modal ref="gameConfigurator" id="gameConfigurator" hide-footer size="lg" title="Configurar Partida">
			<b-row>
				<b-col>
					<b-input-group size="sm" prepend="Precio carton" append="€">
						<b-form-input id="cardboardPrice" type="number"></b-form-input>
					</b-input-group>
				</b-col>
				<b-col>
					<b-input-group size="sm" prepend="Premio Bingo" append="%">
						<b-form-input id="bingoPrize" type="number"></b-form-input>
					</b-input-group>
				</b-col>
			</b-row>
			<br>
			<b-row>
				<b-col>
					<b-input-group size="sm" prepend="Premio Línea" append="%">
						<b-form-input id="linePrize" type="number"></b-form-input>
					</b-input-group>
				</b-col>
				<b-col>
					<b-input-group size="sm" prepend="Retención Banca" append="%">
						<b-form-input id="bankingRetention" type="number"></b-form-input>
					</b-input-group>
				</b-col>
				<br>
			</b-row>
			<b-row class="text-center">
				<b-col id="errorGameConfigurator" class="modalError"></b-col>
			</b-row>
			<b-btn class="mt-3" variant="outline-success" block v-on:click="saveGameConfiguration">Guardar</b-btn>
		</b-modal>

		<b-modal ref="userConfigurator" id="userConfigurator" hide-footer title="Administrar Jugadores">
			<div class="currentUsers" >
				<b-row class="userElement" v-if="data.users" v-for="user in data.users" v-bind:key="user.id">
					<b-col>
						<b-input-group :prepend="String(user.id)">
							<b-form-input v-model="user.name" readonly></b-form-input>
							<b-input-group-append>
								<b-btn variant="outline-danger" v-on:click="removeUser(user.id)">Borrar</b-btn>
							</b-input-group-append>
						</b-input-group>
					</b-col>
				</b-row>
			</div>
			<hr/>
			<b-row class="userElement">
				<b-col>
					<b-input-group prepend="Id">
						<b-form-input id="addUser" @keydown.native.enter="addNewUser"></b-form-input>
						<b-input-group-append>
							<b-btn variant="outline-info" v-on:click="addNewUser">Nuevo</b-btn>
						</b-input-group-append>
					</b-input-group>
				</b-col>
			</b-row>
			<b-row class="text-center">
				<b-col id="errorUserConfigurator" class="modalError"></b-col>
			</b-row>
		</b-modal>

		<b-modal ref="callLineModal" id="callLineModal" hide-footer size="lg" title="Cantar Línea">
			<b-row>
				<b-col>
					<div>
						<b-form-select v-if="resume.call" v-model="resume.call.selected" :options="resume.call.options" class="mb-3 lineSelector" />
					</div>
				</b-col>
			</b-row>
			<b-row>
				<b-col>
					<b-form-input class="lineNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="lineNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="lineNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="lineNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="lineNumber" type="number"></b-form-input>
				</b-col>
			</b-row>
			<b-row class="text-center">
				<b-col id="errorCallLine" class="modalError"></b-col>
			</b-row>
			<b-btn class="mt-3" variant="outline-success" block v-on:click="saveCallLine">Cantar</b-btn>
		</b-modal>

		<b-modal ref="callBingoModal" id="callBingoModal" hide-footer size="lg" title="Cantar Bingo">
			<b-row>
				<b-col>
					<div>
						<b-form-select v-if="resume.call" v-model="resume.call.selected" :options="resume.call.options" class="mb-3 bingoSelector" />
					</div>
				</b-col>
			</b-row>
			<b-row class="bingo-row">
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
			</b-row>
			<b-row class="bingo-row">
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
			</b-row>
			<b-row class="bingo-row">
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
				<b-col>
					<b-form-input class="bingoNumber" type="number"></b-form-input>
				</b-col>
			</b-row>
			<b-row class="text-center">
				<b-col id="errorCallBingo" class="modalError"></b-col>
			</b-row>
			<b-btn class="mt-3" variant="outline-success" block v-on:click="saveCallBingo">¡Bingo!</b-btn>
		</b-modal>

		<b-modal ref="prizeModal" id="prizeModal" centered hide-footer size="lg" title="Premios">
			<b-row class="text-center prize">
				<b-col v-if="(lineCalled && !endGame)">
					¡Enhorabuena {{data.lastLineWinner}} has ganado la línea! <span class="text-success">{{resume.linePrize}} €</span>
				</b-col>
				<b-col v-if="(lineCalled && endGame)">
					!Enhorabuena {{data.lastBingoWinner}} has ganado el bingo! <span class="text-success">{{resume.bingoPrize}} €</span>
				</b-col>
			</b-row>
		</b-modal>
	</b-container>
</template>

<script>
export default {
	name : 'bingoView',
	data() {
		return {
			data: this.$root.getGameData(),
			resume: {},
			maxNumber: this.$root.config.maxNumber,
			gameNumbers: [],
			cols: this.$root.config.colsNumber,
			rows: null,
			nextNumberSeconds: this.$root.config.nextNumberSeconds,
			pause: false,
			intervalGame: null,
			lineCalled: false,
			endGame: false
		}
	},
	mounted: function()
	{		
		/** Initial module instance */
		this.rows = Math.round(this.maxNumber / this.cols);

		for (var i = 1; i <= this.maxNumber; i++) { 
			this.gameNumbers.push(i); 
		}
	},
	updated: function()
	{
		/** after render */
	},
	methods: {
		startGame: function() {
			var that = this;

			var bets = this.resume.bets || [];
			if (!this.data.gameConfigured || !this.data.usersReady || bets.length <= 1)
			{
				return;
			}

			var gameStartElements = document.querySelectorAll(".game-start");
			gameStartElements.forEach(function(element) {
				element.classList.add("game-hide");
			});

			var gameElements = document.querySelectorAll(".game-element");
			gameElements.forEach(function(element) {
				element.classList.remove("game-hide");
			});

			var betInputs = document.querySelectorAll(".inputBet");
			betInputs.forEach(function(element) {
				element.disabled = true;
			});

			var options = [
				{
					value: null, 
					text: 'Selecciona una opción' 
				}
			];
			this.resume.bets.forEach(element => {
				options.push({
					value: element.name,
					text: element.name
				});
			});

			var call = {
				selected: null,
				options: options
			};
			this.$set(this.resume, 'call', call);

			this.intervalGame = setInterval(function(){
				that.nextNumber();
			}, that.nextNumberSeconds * 1000);
		},
		nextNumber: function() {
			var endGame = this.gameNumbers.length == 0 || this.endGame;

			if (!this.pause && !endGame) {
				var randomPosition = Math.floor(Math.random() * (this.gameNumbers.length));
				var randomNumber = this.gameNumbers[randomPosition];

				this.showPriceNumber(randomNumber);

				this.gameNumbers.splice(randomPosition, 1);
			}
			else if (endGame) {
				clearInterval(this.intervalGame);

				var element = document.querySelector("#pauseButtomRow");
				element.classList.add('game-hide');

				var endGameElements = document.querySelectorAll(".game-end");
				endGameElements.forEach(element => {
					element.classList.remove('game-hide');
				});
			}	
		},
		pauseGame: function() {
			var element = document.querySelector("#pauseButtom");

			if (!this.pause) {
				element.classList.remove("btn-primary");
				element.classList.add("btn-warning");
				element.innerText = 'En pausa';
			}
			else {
				element.classList.remove("btn-warning");
				element.classList.add("btn-primary");
				element.innerText = 'Pausar';
			}

			this.pause = !this.pause;
		},
		showPriceNumber: function(number) {
			/** boardgame */
			var element = document.querySelector("[data-boarNumber='"+number+"']");
			element.classList.add("board-number-prize");

			/** last prize number */
			element = document.querySelector("#lastPrizeNumber");
			element.classList.remove("game-hide");
			element.classList.add("animation");
			element.innerText = number;

			element.addEventListener("animationend", function(){
				element.classList.remove("animation");
			}, false);

			/** audio ball */
			var audioBall = new Audio(require("../assets/sounds/ball.mp3"));
			audioBall.play();

			/** audio number */
			var audio = new Audio(require("../assets/sounds/"+number+".mp3"));
			audio.play();

			console.log(number);
		},
		showGameConfigurator: function() {
			this.$refs.gameConfigurator.show();
			var element;

			if (this.data.cardboardPrice != null) {
				element = document.querySelector('#cardboardPrice');
				element.value = this.data.cardboardPrice;
			}
			if (this.data.linePrize != null) {
				element = document.querySelector('#linePrize');
				element.value = this.data.linePrize;
			}
			if (this.data.bingoPrize != null) {
				element = document.querySelector('#bingoPrize');
				element.value = this.data.bingoPrize;
			}
			if (this.data.bankingRetention != null) {
				element = document.querySelector('#bankingRetention');
				element.value = this.data.bankingRetention;
			}

			document.querySelector('#errorGameConfigurator').innerText = '';
		},
		saveGameConfiguration: function() {
			var status = true;

			var cardboardPrice = parseFloat(document.querySelector('#cardboardPrice').value) || 0;
			var linePrize = parseInt(document.querySelector('#linePrize').value) || 0;
			var bingoPrize = parseInt(document.querySelector('#bingoPrize').value) || 0;
			var bankingRetention = parseInt(document.querySelector('#bankingRetention').value) || 0;

			var rangeValues = linePrize + bingoPrize + bankingRetention;
			
			if (rangeValues < 100 || rangeValues > 100 || cardboardPrice == 0) {
				status = false;
			}

			if (status) {
				this.$set(this.data, 'cardboardPrice', cardboardPrice);
				this.$set(this.data, 'linePrize', linePrize);
				this.$set(this.data, 'bingoPrize', bingoPrize);
				this.$set(this.data, 'bankingRetention', bankingRetention);
				this.$set(this.data, 'gameConfigured', true);

				this.$refs.gameConfigurator.hide();
				this.$root.saveGameData(this.data);
			} else {
				document.querySelector('#errorGameConfigurator').innerText = 'Error, compruebe que los rangos porcentuales sumen 100 entre si o agrege un valor al cartón';
			}

			this.updatePrizes();
		},
		showUserConfigurator: function() {
			this.$refs.userConfigurator.show();

			var users = this.data.users;
			if (users != null) {
				/** Do something */
			}

			document.querySelector('#errorUserConfigurator').innerText = '';
		},
		addNewUser: function() {
			var status = true;

			var userIdAut = this.data.userIdAut;
			if (userIdAut == null) {
				userIdAut = 1;
			}

			var addUserElement = document.querySelector('#addUser');
			if (addUserElement.value == '') {
				status = false;
			}

			if (status) {
				var users = this.data.users;

				if (users == null) {
					users = [];
				}
				users.push({
					id: userIdAut,
					name: addUserElement.value,
					lastCardboardBetNumber: 1
				});
				
				this.data.userIdAut = userIdAut + 1;
				if (users.length > 1) {
					this.data.usersReady = true;
				} else {
					this.data.usersReady = false;
				}

				this.$set(this.data, 'users', users);
				this.$root.saveGameData(this.data);

				addUserElement.value = '';
			} else {
				document.querySelector('#errorUserConfigurator').innerText = 'Introduzca un nombre válido';
			}			
		},
		removeUser: function(id) {
			var users = this.data.users;

			users = users.filter(function(obj) {
				return obj.id != id;
			});

			var bets = this.resume.bets || [];
			bets = bets.filter(function(obj) {
				return obj.id != id;
			});

			if (users.length > 1) {
				this.data.usersReady = true;
			} else {
				this.data.usersReady = false;
			}

			this.$set(this.data, 'users', users);
			this.$set(this.resume, 'bets', bets);

			this.$root.saveGameData(this.data);
			this.updatePrizes();
		},
		updateBet: function(event) {
			var that = this;

			var element = event.target;
			var userId = element.getAttribute('data-id');
			var name = '';

			this.data.users.forEach(element => {
				if (element.id == userId) {
					name = element.name;
				}
			});

			var inputElement = document.querySelector(".bet-input[data-id='"+userId+"']");

			var isChecked = element.checked;
			var cardboardNumber = parseInt(inputElement.value) || 1;
			var bets = this.resume.bets;

			if (isChecked) {
				if (bets == null) {
					bets = [];
				}
				bets.push({
					id: userId,
					name: name,
					cardboardNumber: cardboardNumber
				});

				this.data.users.forEach(function(element, index) {
					if(element.id == userId) {
						that.data.users[index].lastCardboardBetNumber = cardboardNumber;
					}
				});

				inputElement.disabled = true;

				this.$set(this.resume, 'bets', bets);
				this.$root.saveGameData(this.data);
			} else {
				bets = bets.filter(function(obj) {
					return obj.id != userId;
				});

				inputElement.disabled = false;

				this.$set(this.resume, 'bets', bets);
			}

			this.updatePrizes();
		},
		updatePrizes: function() {
			var bets = this.resume.bets || [];

			if (!this.data.gameConfigured || !this.data.usersReady || bets.length < 1) {
				return;
			}

			var that = this;
			var moneyCollected = 0;

			this.resume.bets.forEach(function(element) {
				moneyCollected += element.cardboardNumber * that.data.cardboardPrice;
			});

			var bingoPrize = (moneyCollected * this.data.bingoPrize) / 100;
			var linePrize = (moneyCollected * this.data.linePrize) / 100;
			var bankingRetention = (moneyCollected * this.data.bankingRetention) / 100;

			this.$set(this.resume, 'moneyCollected', Number(moneyCollected).toFixed(2));
			this.$set(this.resume, 'bingoPrize', Number(bingoPrize).toFixed(2));
			this.$set(this.resume, 'linePrize', Number(linePrize).toFixed(2));
			this.$set(this.resume, 'bankingRetention', Number(bankingRetention).toFixed(2));
		},
		callLine: function() {
			var lineMinimum = this.maxNumber - 5;
			if (this.gameNumbers.length > lineMinimum) {
				return;
			}

			var lineElements = document.querySelectorAll(".lineNumber");
			lineElements.forEach(element => {
				element.value = '';
				element.classList.remove("border-danger");
				element.classList.remove("border-info");
			});
			document.querySelector('#errorCallLine').innerText = '';

			if (!this.pause) {
				this.pauseGame();
			}
			this.$refs.callLineModal.show();
		},
		saveCallLine: function() {
			var that = this;
			var status = true;

			var lineElements = document.querySelectorAll(".lineNumber");
			var lineSelectorElement = document.querySelector(".lineSelector");
			var lineButtom = document.querySelector("#callLine");

			document.querySelector('#errorCallLine').innerText = '';

			var lastNumberElements = [];
			var numberClone = false;
			lineElements.forEach(element => {
				if (lastNumberElements.includes(element.value)) {
					element.classList.add("border-info");
					element.classList.remove("border-danger");
					numberClone = true;
				} else {
					lastNumberElements.push(element.value);
					element.classList.remove("border-info");
					element.classList.remove("border-danger");
				}
			});

			if ((lineSelectorElement.value == '' || lineSelectorElement.value == null) || numberClone) {
				return;
			}

			lineElements.forEach(element => {
				if (that.gameNumbers.includes(parseInt(element.value)) || element.value == '' || (element.value < 1 || element.value > this.maxNumber)) {
					element.classList.add("border-danger");
					status = false;
				} else {
					element.classList.remove("border-danger");
				}
			});

			if (status) {				
				this.$set(this.data, 'lastLineWinner', lineSelectorElement.value);
				this.$set(this, 'lineCalled', true);
				this.$root.saveGameData(this.data);

				lineButtom.disabled = true;
				lineButtom.classList.remove('btn-info');
				lineButtom.classList.add('btn-light');

				/** line audio */
				var lineAudio = new Audio(require("../assets/sounds/line.mp3"));
				lineAudio.play();
				
				this.$refs.callLineModal.hide();
				this.$refs.prizeModal.show();
			} else {
				document.querySelector('#errorCallLine').innerText = 'Lo sentimos, alguno de los números introducidos no han sido premiados';
			}
		},
		callBingo: function() {
			var bingoMinimum = this.maxNumber - 15;

			if (this.gameNumbers.length > bingoMinimum || !this.lineCalled) {
				return;
			}

			var bingoElements = document.querySelectorAll(".bingoNumber");
			bingoElements.forEach(element => {
				element.value = '';
				element.classList.remove("border-danger");
				element.classList.remove("border-info");
			});
			document.querySelector('#errorCallBingo').innerText = '';

			if (!this.pause) {
				this.pauseGame();
			}
			this.$refs.callBingoModal.show()
		},
		saveCallBingo: function() {
			var that = this;
			var status = true;

			var bingoElements = document.querySelectorAll(".bingoNumber");
			var bingoSelectorElement = document.querySelector(".bingoSelector");
			var bingoButtom = document.querySelector("#callBingo");

			document.querySelector('#errorCallBingo').innerText = '';

			var lastNumberElements = [];
			var numberClone = false;
			bingoElements.forEach(element => {
				if (lastNumberElements.includes(element.value)) {
					element.classList.add("border-info");
					element.classList.remove("border-danger");
					numberClone = true;
				} else {
					lastNumberElements.push(element.value);
					element.classList.remove("border-info");
					element.classList.remove("border-danger");
				}
			});

			if ((bingoSelectorElement.value == '' || bingoSelectorElement.value == null) || numberClone) {
				return;
			}

			bingoElements.forEach(element => {
				if (that.gameNumbers.includes(parseInt(element.value)) || element.value == '' || (element.value < 1 || element.value > this.maxNumber)) {
					element.classList.add("border-danger");
					status = false;
				} else {
					element.classList.remove("border-danger");
				}
			});

			if (status) {				
				this.$set(this.data, 'lastBingoWinner', bingoSelectorElement.value);
				this.$set(this, 'endGame', true);
				this.$root.saveGameData(this.data);

				bingoButtom.disabled = true;
				bingoButtom.classList.remove('btn-info');
				bingoButtom.classList.add('btn-light');

				/** bingo audio */
				var bingoAudio = new Audio(require("../assets/sounds/bingo.mp3"));
				bingoAudio.play();

				this.$refs.callBingoModal.hide();
				this.$refs.prizeModal.show();
			} else {
				document.querySelector('#errorCallBingo').innerText = 'Lo sentimos, alguno de los números introducidos no han sido premiados';
			}
		},
		newGame: function() {
			this.$router.go();
		}
	}
};
</script>
<style scoped>
	.menu {
		margin-bottom: 50px;
	}
	.board-col {
		margin: 10px;
	}
	.board-number {
		padding: 7px;
		width: 40px;
		height: 40px;
		text-align: center;
	}
	.board-number-prize {
		background-color: #73efa6;
		font-weight: bold;
		border-color: #ffbf00 !important;
		border-width: 3px !important;
		animation-name: showNumberPrice;
		animation-timing-function: ease-in-out;
		animation-duration: 2.0s;
		animation-fill-mode: forwards;
	}
	.game-hide {
		display: none;
	}
	.userElement {
		margin: 10px;
	}
	.modalError {
		margin: 10px;
		font-weight: bold;
		color: red;
	}
	.betElement {
		margin: 10px;
	}
	.variant-bet {
		font-size: 14px;
	}
	.resume-trophy {
		font-size: 100px;
	}
	.resumePriceElement {
		margin: 20px;
		font-size: 20px;
	}
	.board-element {
		margin: 20px;
	}
	.prize {
		font-size: 50px;
		font-weight: bold;
	}
	.bingo-row {
		margin: 10px;
	}
	.table-last-winners {
		font-size: 14px;
	}

	#lastPrizeNumber {
		text-align: center;
		font-weight: bold;
		font-size: 90px;
		padding: 10px;
		margin-top: 50%;
		width: 40%;
		border: 3px solid black;
		border-radius: 50%;
		background-color: #ffbf00;
		color: white;
	}
	#lastPrizeNumber.animation {
		animation-name: showLastNumber;
		animation-timing-function: ease-in-out;
		animation-duration: 2s;
		animation-fill-mode: forwards;
	}
	/** animations */
	@keyframes showNumberPrice {
		0% {
			transform: rotate(0deg);
			transform: scale(8.0);
			opacity: 0;
		}
		100% {
			transform: rotate(360deg);
			transform: scale(1.0);
			opacity: 1;
		}
	}

	@keyframes showLastNumber {
		0% {
			transform: rotateX(180deg);
			color: #ffbf00;
		}
		100% {
			transform: rotateX(0deg);
		}
	}
</style>