---
title: Tell us about yourself
type: blank
---


<div class = "form-group">
<label for = "q1age">1. What is your age? </label>
<input type="number" class="form-control"  id = "age" name = "q1age" min = "18">
</div>

<div class = "form-group">
<label for = "q2gender">2. Please enter your gender in the field below:</label>
<textarea class = "form-control" type = "text" id = "gender" name = "q2gender" rows = "1" cols = "30">
</textarea>

</div>

<div class = "form-group">
<label for = "q3ecology">
3. What is your interest in ecology? </label>
<select class = "form-control" name = "q3ecology">
<option value="" selected disabled>Please select</option>
<option id = "casual interest_ecology" name = "q3ecology"> Casual interest </option>
<option id = "prof interest_ecology" name = "q3ecology"> Professional interest </option>
<option id = "non interest ecology" name = "q3ecology"> No interest </option>
</select>
</div>

<div class="form-group"> <label for = "q4_interest in ecology_qual">
4. If you answered 'casual interest' or 'professional interest' can you tell us more about it here?</label>
<textarea name ="q4_interest in ecology_qual" class="form-control"></textarea>
</div>


<label class= "statement" for = "q5_ecoacousticsKnowledge">5. Please indicate your highest level of expertise with either soundscape ecology, ecoacoustics or bioacoustics:  </label>
<ul class = "likert">
    <li>
        <input type="radio" name="q5_ecoacousticsKnowledge" value="1" >
        <label>No expertise</label>
     </li>
      <li>
     <input type="radio" name="q5_ecoacousticsKnowledge" value="2" >
        <label></label>
    </li>
      <li>
      <input type="radio" name="q5_ecoacousticsKnowledge" value="3" >
        <label></label>
     </li>
      <li>
      <input type="radio" name="q5_ecoacousticsKnowledge" value="4" >
        <label></label>
    </li>
      <li>
     <input type="radio" name="q5_ecoacousticsKnowledge" value="5" >
        <label></label>
    </li>
      <li>
     <input type="radio" name="q5_ecoacousticsKnowledge" value="6" >
        <label></label>
    </li>
      <li>
     <input type="radio" name="q5_ecoacousticsKnowledge" value="7" >
        <label>Very high expertise</label>
     </li>
</ul>


<label class= "statement" for = "q6_expEnvRecordings">6. How experienced are you with using environmental audio recordings? </label>
<ul class= "likert">
     <li>
        <input type="radio" name="q6_expEnvRecordings" value="1">
        <label>Not at all experienced</label>
    </li>
      <li>
        <input type="radio" name="q6_expEnvRecordings" value="2">
        <label></label>
    </li>
      <li>
        <input type="radio" name="q6_expEnvRecordings" value="3">
        <label></label>
    </li>
      <li>
        <input type="radio" name="q6_expEnvRecordings" value="4">
        <label></label>
        </li>
      <li>
        <input type="radio" name="q6_expEnvRecordings" value="6">
        <label></label>
        </li>
      <li>
        <input type="radio" name="q6_expEnvRecordings" value="6">
        <label></label>
    </li>
      <li>
        <input type="radio" name="q6_expEnvRecordings" value="7">
        <label>Very experienced</label>
    </li>
</ul>

<label class= "statement" for= "q7_expAcousVis">7. How experienced are you with using any kind of acoustic visualisation (e.g. waveforms, spectrograms)?</label>
<ul class="likert">
     <li>
        <input type="radio" name="q7_expAcousVis" value="1">
        <label>Not at all experienced</label>
    </li>
      <li>
        <input type="radio" name="q7_expAcousVis" value="2">
        <label></label>
    </li>
      <li>
        <input type="radio" name="q7_expAcousVis" value="3">
        <label></label>
    </li>
      <li>
        <input type="radio" name="q7_expAcousVis" value="4">
        <label></label>
    </li>
      <li>
      <input type="radio" name="q7_expAcousVis" value="5">
        <label></label>
    </li>
      <li>
      <input type="radio" name="q7_expAcousVis" value="6">
        <label></label>
    </li>
      <li>
        <input type="radio" name="q7_expAcousVis" value="7">
        <label>Very experienced</label>
    </li>
</ul>


<label for = "colourblind"> 8. To your knowledge, do you have any kind of colour blindness? </label>
 <div class="custom-control custom-radio">
  <input type="radio" id="colourblind_no" name="colourblind" class="custom-control-input" value = "No">
<label class="custom-control-label" for = "colourblind_no">
No </label>
</div>
<div class="custom-control custom-radio">
  <input type="radio" id="colourblind_yes" name="colourblind" class="custom-control-input" value = "Yes">
<label class="custom-control-label" for= "colourblind_yes">
Yes </label>
</div>

<div class = "form-group">
<label for = "colourblind_details"> If you answered 'yes', can you please provide details below? </label>
<textarea name ="colourblind_details" class="form-control"></textarea>
</div>
