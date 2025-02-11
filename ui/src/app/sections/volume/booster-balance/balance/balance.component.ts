import { Component, OnInit, Input } from '@angular/core'
import { BalanceService } from './balance.service'
import { ApplicationService } from '../../../../services/app.service'
import { KnobValueChangedEvent } from '../../../../modules/eqmac-components/components/knob/knob.component'
import { FlatSliderValueChangedEvent } from '../../../../modules/eqmac-components/components/flat-slider/flat-slider.component'
import { UIService } from '../../../../services/ui.service'

@Component({
  selector: 'eqm-balance',
  templateUrl: './balance.component.html',
  styleUrls: [ './balance.component.scss' ]
})
export class BalanceComponent implements OnInit {
  balance = 0
  @Input() animationDuration = 500
  @Input() animationFps = 30
  @Input() hide = false
  replaceKnobsWithSliders = false

  constructor (
    public balanceService: BalanceService,
    public app: ApplicationService,
    public ui: UIService
  ) { }

  ngOnInit () {
    this.sync()
    this.setupEvents()
  }

  async sync () {
    await Promise.all([
      this.syncUISettings(),
      this.getBalance()
    ])
  }

  async syncUISettings () {
    const uiSettings = await this.ui.getSettings()
    this.replaceKnobsWithSliders = uiSettings.replaceKnobsWithSliders
  }

  protected setupEvents () {
    this.balanceService.onBalanceChanged((balance) => {
      this.balance = balance
    })
    this.ui.settingsChanged.subscribe(uiSettings => {
      this.replaceKnobsWithSliders = uiSettings.replaceKnobsWithSliders
    })
  }

  async getBalance () {
    this.balance = await this.balanceService.getBalance()
  }

  async setBalance (event: KnobValueChangedEvent | FlatSliderValueChangedEvent) {
    this.balanceService.setBalance(event.value, event.transition)
  }

  performHapticFeedback (animating) {
    if (!animating) {
      this.app.haptic()
    }
  }
}
